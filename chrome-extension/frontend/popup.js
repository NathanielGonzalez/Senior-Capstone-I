document.addEventListener("DOMContentLoaded", function () {
    // Sign up & login page
    const authPage = document.getElementById("authPage");
    const authForm = document.getElementById("authForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const authButton = document.getElementById("authButton");
    const formTitle = document.getElementById("formTitle");
    const toggleText = document.getElementById("toggleText");

    const uploadPage = document.getElementById("uploadPage");

    const attendancePage = document.getElementById("attendancePage")

    // Starts on sign up page
    let isSignup = true;

//-----------------------------------------------------SIGN UP & LOGIN PAGE---------------------------------------------------------------
    // Function to change sign up page to login page
    function updateForm() {
        if (isSignup) {
            formTitle.textContent = "Sign Up";
            authButton.textContent = "Sign Up";
            toggleText.innerHTML = `Already have an account? <a href="#" id="toggleLink">Login</a>`;
        } else {
            formTitle.textContent = "Login";
            authButton.textContent = "Login";
            toggleText.innerHTML = `Don't have an account? <a href="#" id="toggleLink">Sign Up</a>`;
        }

        usernameInput.value = "";
        passwordInput.value = "";

        document.getElementById("toggleLink").addEventListener("click", function (e) {
            e.preventDefault();
            isSignup = !isSignup;
            updateForm();
        });
    }

    updateForm(); 

    // Event listener for submit button to change from login page to attendannce page
    authForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Gets username and password for sign up and from login
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (isSignup) {
            // Send a POST request (to store sign up info) to backend
            fetch('https://capstoneserver-puce.vercel.app/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username,
                    pin: password,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('professor_id', data.user.id);

                    alert("Signup successful! Enter your class data.");
                    authPage.style.display = "none";
                    attendancePage.style.display = "none";
                    uploadPage.style.display = "block";
                } else {
                    alert("Error signing up! Username already taken! Please try again");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Signup failed. Please try again.");
            });
        } 
        else {
            // Send a POST request to backend to log in the user
            fetch('https://capstoneserver-puce.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username,
                    pin: password,
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('professor_id', data.professor_id);
                    alert("Login successful!");
                    getAndDisplayCourses(professorId);
                    authPage.style.display = "none";
                    uploadPage.style.display = "none";
                    attendancePage.style.display = "block";
                    clearAttendancePage();
                } else {
                    alert("Invalid username or password.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Login failed. Please try again.");
            });
        }
    });
//-----------------------------------------------------UPLOAD PAGE------------------------------------------------------------------
    const teacherNameInput = document.getElementById("teacherName");
    const uploadButton = document.getElementById("uploadButton");
    const goToLogin = document.getElementById("goToLogin");

    // Function to add a new file input with a delete button
    function addFileInput() {
        const fileWrapper = document.createElement("div");
        fileWrapper.className = "fileUploadRow"; 
 
        const newFileInput = document.createElement("input");
        newFileInput.type = "file";
        newFileInput.className = "fileInput";

        const courseNameInput = document.createElement("input");
        courseNameInput.type = "text";
        courseNameInput.className = "courseNameInput";
        courseNameInput.placeholder = "Course name?";
        
        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteFile";
        deleteButton.innerHTML = "❌";

        deleteButton.addEventListener("click", function () {
            fileWrapper.remove();
        });

        fileWrapper.appendChild(courseNameInput);
        fileWrapper.appendChild(newFileInput);
        fileWrapper.appendChild(deleteButton);

        document.getElementById("fileUploadContainer").appendChild(fileWrapper);
    }

    // Event listener for "Add File" button
    document.getElementById("addFile").addEventListener("click", addFileInput);

    // Event listener for upload file button
    uploadButton.addEventListener("click", function () {
        const professorId = localStorage.getItem('professor_id');

        const teacherName = teacherNameInput.value.trim();  

        if (!teacherName) {
            alert("Please enter your name.");
            return;
        }

        const fileInputs = document.querySelectorAll(".fileInput");
        const courseNameInputs = document.querySelectorAll(".courseNameInput");

        let hasFiles = false;

        for (let i = 0; i < fileInputs.length; i++) {
            const input = fileInputs[i];
            const courseName = courseNameInputs[i].value.trim();
    
            if (input.files.length > 0 && courseName) {
                const courseCsvFile = input.files[0];
                hasFiles = true;

                const formData = new FormData();
                formData.append("professor_id", professorId);
                formData.append("name", courseName);
                formData.append("coursecsv", courseCsvFile);
                
                // Fetch request to upload each course
                fetch('https://capstoneserver-puce.vercel.app/addcourse', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Course "${courseName}" uploaded successfully!`);
                    } else {
                        alert(`Error adding course "${courseName}": ${data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error uploading course "${courseName}". Please try again.`);
                });  
            } else {
                alert("Please provide a course name and select a file for each class.");
                return;
            }
        }

        // Make sure at least one file is uploaded
        if (!hasFiles) {
            alert("Please select at least one file to upload.");
            return;
        }
    });

    // Clear previous data when the upload page is loaded or when the user logs out
    function clearUploadPage() {
        const fileUploadContainer = document.getElementById("fileUploadContainer");
        fileUploadContainer.innerHTML = '';
        teacherNameInput.value = ''; 
    }

    // Event listener to go back to login page from upload page
    goToLogin.addEventListener("click", function () {
        clearUploadPage();
        uploadPage.style.display = "none";
        authPage.style.display = "block";
        isSignup = false;
        updateForm();
    });
//-----------------------------------------------------ATTENDANCE PAGE------------------------------------------------------------------
    const classDropdown = document.getElementById("classDropdown");
    const attendanceTable = document.getElementById("attendanceTable");
    const attendanceBody = document.getElementById("attendanceBody");
    const autoAttendance = document.getElementById("autoAttendance");
    const manualAttendance = document.getElementById("manualAttendance");
    const exportResults = document.getElementById("exportResults");
    const editClassButton = document.getElementById("editClassButton");
    const attendanceStatus = document.getElementById("attendanceStatus");
    const editClassesPage = document.getElementById("editClassesPage");

    let isManualMode = false;

    const professorId = localStorage.getItem('professor_id');

    // Function to clear attendancePage when going back to it
    function clearAttendancePage(){
        attendanceBody.innerHTML = "";
        attendanceTable.style.display = "none";
    }

    // Shows courses based on logged in professor
    function getAndDisplayCourses(professorId) {
        fetch(`https://capstoneserver-puce.vercel.app/courses/${professorId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(courses => {
                // Clear existing class options
                classDropdown.innerHTML = '<option value="" disabled selected>Select a class</option>';
                // Populate class dropdown with professor courses
                courses.forEach(course => {
                    let option = document.createElement("option");
                    option.value = course.id; // Assuming each course has a unique 'id'
                    option.textContent = course.name;
                    classDropdown.appendChild(option);
                });
                // Enable class dropdown
                classDropdown.disabled = false;
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                alert('Failed to load courses. Please try again later.');
            });
    }

    // Displays students in the course in table
    function getAndDisplayStudents(courseId){
        fetch(`https://capstoneserver-puce.vercel.app/students/${courseId}`, {})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(students => {
                // Clear existing table rows
                attendanceBody.innerHTML = "";
                // Populate table with fetched students
                students.forEach(student => {
                    let row = document.createElement("tr");
    
                    let nameCell = document.createElement("td");
                    nameCell.textContent = student.name;
    
                    let idCell = document.createElement("td");
                    idCell.textContent = student.id;
    
                    let attendanceCell = document.createElement("td");
                    let attendanceButton = document.createElement("button");
                    attendanceButton.textContent = "N/A";
                    attendanceButton.classList.add("null");
                    // Attendance cant be taken yet
                    attendanceButton.disabled = true;

                    // Event listener for pressing an attendance button
                    attendanceButton.addEventListener("click", function () {
                        // Checks if manual button is pressed, changes attendance on click
                        if (isManualMode) {
                            if (attendanceButton.classList.contains("absent")) {
                                attendanceButton.classList.remove("absent");
                                attendanceButton.classList.add("present");
                                attendanceButton.textContent = "Present";
                            } else {
                                attendanceButton.classList.remove("present");
                                attendanceButton.classList.add("absent");
                                attendanceButton.textContent = "Absent";
                            }
                        }
                    });

                    attendanceCell.appendChild(attendanceButton);
                    row.appendChild(nameCell);
                    row.appendChild(idCell);
                    row.appendChild(attendanceCell);

                    attendanceBody.appendChild(row);
                });

                attendanceTable.style.display = "block";
                autoAttendance.disabled = false;
                manualAttendance.disabled = false;
                exportResults.disabled = true;
                attendanceStatus.textContent = "Attendance Status: Not Started";
            })
            .catch(error => {
                console.error('Error fetching students:', error);
                alert('Failed to load students. Please try again later.');
            });
    }

    // Event listener for class dropdown change
    classDropdown.addEventListener("change", function () {
        let selectedCourseId = classDropdown.value;
        if (selectedCourseId) {
            getAndDisplayStudents(selectedCourseId);
        }
    });

    // Event listener for manual attendance
    manualAttendance.addEventListener("click", function () {
        // Set manual mode for other listener
        isManualMode = true;
        attendanceStatus.textContent = "Attendance Status: Manual Mode";

        // Allow all status buttons to be clickable
        document.querySelectorAll("#attendanceBody button").forEach(button => {
            button.disabled = false;
            // Allow for results to be exported
            exportResults.disabled = false;
        });
    });

    // Event listener for auto attendance button
    autoAttendance.addEventListener("click", function () {
        // Change status to show attendance has started
        attendanceStatus.textContent = "Attendance Status: Automatic in Progress";

        // ADD LOGIC TO MARK ATTENDANCE -------------------------------------------------

        // Mark all students as present for now
        document.querySelectorAll("#attendanceBody button").forEach(button => {
            button.classList.remove("null");
            button.classList.remove("absent");
            button.classList.add("present");
            button.textContent = "Present";
            button.disabled = true;
            
            // Allow for results to be exported
            exportResults.disabled = false;
        });
    });

    // Event listener for export results button
    exportResults.addEventListener("click", function () {
        let promises = []; // Array to hold all fetch promises
    
        // Gets student and attendance status
        document.querySelectorAll("#attendanceBody tr").forEach(row => {
            let studentId = row.children[1].textContent;
            let statusButton = row.children[2].children[0];
    
            // Determine the status based on the button's class
            let studentStatus = "N/A";
    
            if (statusButton.classList.contains("present")) {
                studentStatus = "Present";
            } else if (statusButton.classList.contains("absent")) {
                studentStatus = "Absent";
            }
    
            // Create the fetch promise for each student's data export
            let promise = fetch('https://capstoneserver-puce.vercel.app/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    course_id: classDropdown.value,
                    status: studentStatus
                })
            })
            .then(response => {
                if (response.ok) {
                    console.log(`Attendance for student ${studentId} exported successfully.`);
                } else {
                    console.error(`Failed to export attendance for student ${studentId}.`);
                }
            })
            .catch(error => {
                console.error(`Error exporting attendance for student ${studentId}:`, error);
            });
    
            // Add the promise to the promises array
            promises.push(promise);
        });
    
        // Wait for all the promises to resolve
        Promise.all(promises)
            .then(() => {
                alert("All attendance data exported successfully.");
            })
            .catch(() => {
                alert("Error exporting some attendance data. See console");
            });

        alert("Starting export... Please wait for confirmation alert");
    });    

    // Event listener to go to edit classes page from attendance page
    editClassButton.addEventListener("click", function () {
        authPage.style.display = "none";
        uploadPage.style.display = "none";
        attendancePage.style.display = "none";
        editClassesPage.style.display = "block";
        loadCourses();
    });

//-------------------------------------------------EDIT CLASS PAGE-------------------------------------------------------------------------------
    const courseContainer = document.getElementById("previousCoursesContainer");
    const uploadCourseButton = document.getElementById("uploadCourseButton");
    const backToAttendanceButton = document.getElementById("backToAttendance");
    const courseUploadContainer = document.getElementById("courseUploadContainer");

    // Fetch and display professors saved courses
    function loadCourses() {
        fetch(`https://capstoneserver-puce.vercel.app/courses/${professorId}`, {})
            .then(response => response.json())
            .then(data => {
                courseContainer.innerHTML = ""; // Clear list before populating

                data.forEach(course => {
                    addCourseToPage(course.name, course.id);
                });
            })
            .catch(error => console.error("Error fetching courses:", error));
    }

    // Add new saved course to page
    function addCourseToPage(courseName, courseID) {
        const courseEntry = document.createElement("div");
        courseEntry.className = "courseEntry";

        courseEntry.innerHTML = `
            <span>${courseName}</span>
            <button class="deleteCourse">❌</button>
        `;

        // Delete course functionality
        courseEntry.querySelector(".deleteCourse").addEventListener("click", function () {
            removeCourse(courseID, courseEntry);
            
        });

        courseContainer.appendChild(courseEntry);
    }

    // Remove a specific course
    function removeCourse(courseID, courseEntry) {
        fetch("https://capstoneserver-puce.vercel.app/removeCourse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                professor_id: professorId, 
                course_id: courseID
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Successfully removed course.")
                courseEntry.remove();
                loadCourses();
            } else {
                alert("Error removing course.");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Add a new course 
    function addCourse() {
        const courseWrapper = document.createElement("div");
        courseWrapper.className = "courseWrapper"; 

        const newCourseFile = document.createElement("input");
        newCourseFile.type = "file";
        newCourseFile.className = "courseFileInput";

        const courseNameInput = document.createElement("input");
        courseNameInput.type = "text";
        courseNameInput.className = "courseNameInput";
        courseNameInput.placeholder = "Course name?";
        
        const deleteCourseButton = document.createElement("button");
        deleteCourseButton.className = "deleteCourse";
        deleteCourseButton.innerHTML = "❌";

        courseWrapper.appendChild(courseNameInput);
        courseWrapper.appendChild(newCourseFile);
        courseWrapper.appendChild(deleteCourseButton);

        courseUploadContainer.appendChild(courseWrapper);

        deleteCourseButton.addEventListener("click", function () {
            courseWrapper.remove();
        });
    };

    // Event listener for add file button
    document.getElementById("addCourse").addEventListener("click", addCourse);

    // Event listener for upload file button
    uploadCourseButton.addEventListener("click", function () {
        const fileInputs = document.querySelectorAll(".courseFileInput");
        const courseNameInputs = document.querySelectorAll(".courseNameInput");

        let hasFiles = false;

        for (let i = 0; i < fileInputs.length; i++) {
            const input = fileInputs[i];
            const courseName = courseNameInputs[i].value.trim();
    
            if (input.files.length > 0 && courseName) {
                const courseCsvFile = input.files[0];
                hasFiles = true;

                const formData = new FormData();
                formData.append("professor_id", professorId);
                formData.append("name", courseName);
                formData.append("coursecsv", courseCsvFile);
                
                // Fetch request per course
                fetch('https://capstoneserver-puce.vercel.app/addcourse', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(`Course "${courseName}" uploaded successfully!`);
                        loadCourses();
                    } else {
                        alert(`Error adding course "${courseName}": ${data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(`Error uploading course "${courseName}". Please try again.`);
                });  
            } else {
                alert("Please provide a course name and select a file for each class.");
                return;
            }
        }

        // Make sure at least one file is uploaded
        if (!hasFiles) {
            alert("Please select at least one file to upload.");
            return;
        }
    });

    // Back to Login Page
    backToAttendanceButton.addEventListener("click", function () {
        document.getElementById("editClassesPage").style.display = "none";
        document.getElementById("attendancePage").style.display = "none";
        document.getElementById("authPage").style.display = "block";
    });
});