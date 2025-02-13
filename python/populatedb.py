import json
import os
import psycopg2
import face_recognition
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}

print(DB_CONFIG)  # Debugging to ensure values are loaded correctly


#paths
DATA_FILE = "python\sampledata.json"
IMAGE_FOLDER = "python\student_pics"

def connect_db():#connects to db based on config above
    conn = psycopg2.connect(**DB_CONFIG)
    return conn, conn.cursor()

def load_json():#gets json data
    with open(DATA_FILE, "r") as file:
        return json.load(file)

def populate_professors(cursor, professors):#add profs
    for professor in professors:
        cursor.execute(
            "INSERT INTO professors (id, name, pin) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING",
            (professor["id"], professor["name"], professor["pin"])
        )
    print("profs added")

def populate_courses(cursor, courses):
    for course in courses:
        cursor.execute(
            "INSERT INTO courses (id, name, professor_id) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING",
            (course["id"], course["name"], course["professor_id"])
        )
    print("courses asd")

def populate_students(cursor, students):
    for student in students:
        cursor.execute(
            "INSERT INTO students (id, name, course_id) VALUES (%s, %s, %s) ON CONFLICT (id) DO NOTHING",
            (student["id"], student["name"], student["course_id"])
        )
    print("stud")

def encode_and_store_faces(cursor, students):#puts ENCODED student imgs in db
    for student in students:
        image_path = os.path.join(IMAGE_FOLDER, student["image"])
        
        if not os.path.exists(image_path):
            print(f"no img for {student['name']}.")
            continue
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)

        if encodings:
            encoding_array = encodings[0]  
            encoding_json = json.dumps(encoding_array.tolist()) 
            cursor.execute(
                "UPDATE students SET face_encoding = %s WHERE id = %s",
                (encoding_json, student["id"])
            )
            print(f"pic {student['name']} added ")

def main():
    conn, cursor = connect_db()
    data = load_json()

    try:
        populate_professors(cursor, data["professors"])
        populate_courses(cursor, data["courses"])
        populate_students(cursor, data["students"])
        encode_and_store_faces(cursor, data["students"])

        conn.commit()
        print("meow")
    except Exception as e:
        conn.rollback()
        print(f"{e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
