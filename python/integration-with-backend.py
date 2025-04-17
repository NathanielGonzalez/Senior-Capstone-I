import cv2
import face_recognition
import logging
import numpy as np
import requests
import socketio
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
# ---------------- Configuration ----------------
# Replace with your actual backend URL and port (e.g., 'http://192.168.1.100:3000')
BACKEND_URL = 'https://capstoneserver-ndh5.onrender.com'
FLASK_PORT = 5001
ROOM_NUMBER =-1

# Global variables to store known face encodings for attendance
known_face_encodings = []
known_face_ids = []

# ---------------- Flask App Setup ----------------
app = Flask(__name__)
CORS(app)
@app.route('/uploadStudentPhoto', methods=['POST'])
def upload_student_photo():
    """
    Endpoint for students to upload their photo.
    The photo is processed to detect a face and compute its encoding.
    """

    # Ensure a file was uploaded
    if 'photo' not in request.files:
        return jsonify({'success': False, 'message': 'No photo uploaded'}), 406

    # Ensure student_id is provided
    student_id = request.form.get('student_id')
    if not student_id:
        return jsonify({'success': False, 'message': 'Student ID is required'}), 400

    file = request.files['photo']  # ✅ Get the uploaded file

    try:
        image = face_recognition.load_image_file(file)
    except Exception as e:
        return jsonify({'success': False, 'message': 'Invalid image file'}), 400

    # Detect face(s)
    face_locations = face_recognition.face_locations(image)
    if len(face_locations) != 1:
        return jsonify({'success': False, 'message': 'Photo must contain exactly one face'}), 400

    # Encode face
    face_encoding = face_recognition.face_encodings(image, face_locations)[0]
    encoding_list = face_encoding.tolist()  # Convert numpy array to list for JSON serialization
    try:
        response = requests.post(f'{BACKEND_URL}/uploadStudentPictures',
        json={'student_id': student_id, 'face_encoding':encoding_list})
        if response.status_code == 200:
            return jsonify({'success': True, 'message': 'Successfully uploaded student picture.'}), 200
        else:
            # Log the error message
            logging.error(f"Error during POST request: {e}")

        # Return a response indicating failure
        return jsonify({'success': False, 'message': 'Idb update failed'}), 430
    except Exception as e:
          
        return jsonify({'success': False, 'message': 'Idb update fail'}), 430
 
    return jsonify({
        'success': True,
        'face_encoding': encoding_list,
        'message': 'Face encoding processed successfully'
    })
# ---------------- Attendance Processing ----------------
def load_known_faces(course_id):
    """
    Fetch the known face encodings for a given course from the backend.
    """
    global known_face_encodings, known_face_ids
    known_face_encodings.clear()
    known_face_ids.clear()

    try:
        response = requests.get(f'{BACKEND_URL}/students/{course_id}/encodings')
        response.raise_for_status()  # Raise an error for HTTP failures

        data = response.json()
        if data and "students" in data:
            for student in data["students"]:
                if "face_encoding" in student and student["face_encoding"]:
                    encoding = np.array(student["face_encoding"], dtype=np.float32)
                    known_face_encodings.append(encoding)
                    known_face_ids.append(student["id"])
            print(encoding) 
            print(f"Loaded {len(known_face_encodings)} known faces for course {course_id}")
        else:
            print("No face encodings found for this course.")
    except requests.exceptions.RequestException as e:
        print("Error fetching known faces:", e)

def process_attendance(session_id, course_id):
    """
    Captures video from the camera, recognizes faces, and sends attendance records.
    """
    load_known_faces(course_id)

    if not known_face_encodings:
        print("No known faces loaded. Attendance cannot proceed.")
        return

    video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)  # Use DirectShow for Windows
    if not video_capture.isOpened():
        print("Failed to open camera.")
        return

    recognized_ids = set()
    start_time = time.time()
    print("Starting face recognition for attendance...")

    try:
        while time.time() - start_time < 30:  # Run for 30 seconds
            ret, frame = video_capture.read()
            if not ret:
                print("Failed to grab frame from camera.")
                break

            # Resize frame for faster processing
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = small_frame[:, :, ::-1]  # Convert BGR to RGB

            # Detect faces and compute encodings
            face_locations = face_recognition.face_locations(rgb_small_frame)

            if len(face_locations)==0:
                print("No faces detected in this frame.")
                
            else:
                face_encodings = face_recognition.face_encodings(frame)

                for face_encoding in face_encodings:
                    # Find the best match
                    distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                    best_match_index = np.argmin(distances) if len(distances) > 0 else None
                    print(best_match_index)
                    if best_match_index is not None and distances[best_match_index] < 0.8:  # Adjust threshold
                        student_id = known_face_ids[best_match_index]
                        if student_id not in recognized_ids:
                            recognized_ids.add(student_id)

                            payload = {
                                'student_id': student_id,
                                'session_id': session_id,
                                'status': 'Present'
                            }
                            try:
                                attendance_response = requests.post(f'{BACKEND_URL}/attendance', json=payload)
                                if attendance_response.status_code == 201:
                                    print(f"Recorded attendance for student {student_id}")
                                else:
                                    print(f"Failed to record attendance for student {student_id}: {attendance_response.text}")
                            except requests.exceptions.RequestException as e:
                                print("Error posting attendance:", e)

            # Optional: display the video feed
            cv2.imshow('Attendance Camera', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        print("Attendance session ended.")
        video_capture.release()
        cv2.destroyAllWindows()
# ---------------- Socket.IO Client Setup ----------------
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to backend via Socket.IO.")

@sio.event
def disconnect():
    print("Disconnected from backend.")

@sio.on('attendanceStarted')
def handle_attendance_started(data):
    """
    When the backend emits an 'attendanceStarted' event, begin processing attendance.
    Expects the data to include 'course_id'.
    """
    course_id = data.get('courseId')
    session_id = data.get('sessionId')
    print(f"Received attendanceStarted event for course {course_id}")
    if data.get('roomId') == ROOM_NUMBER:
        process_attendance(session_id, course_id)

def start_socketio_client():
    """
    Connects to the Node.js backend as a Socket.IO client and listens for events.
    """
    try:
        sio.connect(BACKEND_URL) 
        sio.wait()  # Keeps the client running
    except Exception as e:
        print("Error connecting to Socket.IO server:", e)

# ---------------- Main -- --------------
if __name__ == '__main__':
    # Start the Socket.IO client in a separate thread
    socket_thread = threading.Thread(target=start_socketio_client)
    socket_thread.daemon = True
    socket_thread.start()

    # Start the Flask web server
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=True)
 