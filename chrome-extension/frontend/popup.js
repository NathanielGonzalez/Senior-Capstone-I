document.addEventListener("DOMContentLoaded", function () {
    //sign up & login page
    const authPage = document.getElementById("authPage");
    const authForm = document.getElementById("authForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const authButton = document.getElementById("authButton");
    const formTitle = document.getElementById("formTitle");
    const toggleText = document.getElementById("toggleText");

    //upload page
    const uploadPage = document.getElementById("uploadPage");
    const teacherNameInput = document.getElementById("teacherName");
    const fileUploadContainer = document.getElementById("fileUploadContainer");
    const uploadButton = document.getElementById("uploadButton");
    const addFileButton = document.getElementById("addFile");
    const goToLogin = document.getElementById("goToLogin");

    //attendance page
    const attendancePage = document.getElementById("attendancePage")
    const teacherDropdown = document.getElementById("teacherDropdown");
    const classDropdown = document.getElementById("classDropdown");
    const attendanceTable = document.getElementById("attendanceTable");
    const attendanceBody = document.getElementById("attendanceBody");
    const autoAttendance = document.getElementById("autoAttendance");
    const manualAttendance = document.getElementById("manualAttendance");
    const exportResults = document.getElementById("exportResults");
    const backToUpload = document.getElementById("backToUpload");
    const attendanceStatus = document.getElementById("attendanceStatus");

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

        // gets username and password for sign up and from login
        const username = usernameInput.value;
        const password = passwordInput.value;

        // EVENTUALLY CHANGE TO INTEGRATE BACKEND ----------------
        if (isSignup) {
            chrome.storage.sync.set({ "username": username, "password": password }, function () {
                alert("Signup successful! Enter your class data.");

                // after sign up, upload page is displayed
                authPage.style.display = "none";
                attendancePage.style.display = "none"; 
                uploadPage.style.display = "block"; 
            });
        } else {
            chrome.storage.sync.get(["username", "password"], function (data) {
                if (data.username === username && data.password === password) {
                    alert("Login successful!");
                    
                    // after login successful, attendance page is displayed
                    authPage.style.display = "none";
                    uploadPage.style.display = "none"; 
                    attendancePage.style.display = "block"; 
                    
                } else {
                    alert("Invalid username or password.");
                }
            });
        }
    });

//-----------------------------------------------------UPLOAD PAGE------------------------------------------------------------------

    // Function to add a new file input with a delete button
    function addFileInput() {
        const fileWrapper = document.createElement("div");
        fileWrapper.className = "fileUploadRow"; 

 
        const newFileInput = document.createElement("input");
        newFileInput.type = "file";
        newFileInput.className = "fileInput";


        const deleteButton = document.createElement("button");
        deleteButton.className = "deleteFile";
        deleteButton.innerHTML = "❌";


        deleteButton.addEventListener("click", function () {
            fileWrapper.remove();
        });

        fileWrapper.appendChild(newFileInput);
        fileWrapper.appendChild(deleteButton);

        document.getElementById("fileUploadContainer").appendChild(fileWrapper);
    }

    // Event listener for "Add File" button
    document.getElementById("addFile").addEventListener("click", addFileInput);

    // Event listener for upload file button
    uploadButton.addEventListener("click", function () {
        if (!teacherNameInput.value.trim()) {
            alert("Please enter your name.");
            return;
        }

        const fileInputs = document.querySelectorAll(".fileInput");
        let hasFiles = false;

        fileInputs.forEach(input => {
            if (input.files.length > 0) {
                hasFiles = true;
            }
        });

        // makes sure at least one file is uploaded
        if (!hasFiles) {
            alert("Please select at least one file to upload.");
            return;
        }

        alert("Files uploaded successfully!");

        //EVENTUALLY ADD LOGIC TO SEND FILES SOMEWHERE TO EXTRACT NECESSARY INFO ----------------
    });

    // Event listener to go back to login page from upload page
    goToLogin.addEventListener("click", function () {
        uploadPage.style.display = "none";
        authPage.style.display = "block";
        isSignup = false;
        updateForm();
    });

//-----------------------------------------------------ATTENDANCE PAGE------------------------------------------------------------------

    // Fake database data
    const teacherData = {
        "Mr. Smith": ["Math 101", "Science 201"],
        "Ms. Johnson": ["History 102", "English 202"]
    };

    const studentData = {
        "Math 101": [
            { name: "Alice Johnson", id: "S001" },
            { name: "Bob Smith", id: "S002" }
        ],
        "Science 201": [
            { name: "Charlie Brown", id: "S003" },
            { name: "David Lee", id: "S004" }
        ],
        "History 102": [
            { name: "Eve Adams", id: "S005" },
            { name: "Frank White", id: "S006" }
        ],
        "English 202": [
            { name: "Grace Miller", id: "S007" },
            { name: "Henry Green", id: "S008" }
        ]
    };

    // Populate teacher dropdown (EVENTUALLY CHANGE TO DATABASE) --------------
    Object.keys(teacherData).forEach(teacher => {
        let option = document.createElement("option");
        option.value = teacher;
        option.textContent = teacher;
        teacherDropdown.appendChild(option);
    });

    let students = [];
    let attendanceTaken = false;

    // Event listener for teacher dropdwon
    teacherDropdown.addEventListener("change", function () {
        // Reset class dropdown on click
        classDropdown.innerHTML = '<option value="" disabled selected>Select a class</option>'; 
        let selectedTeacher = teacherDropdown.value;

        // Populate student dropdown based on teacher value (EVENTUALLY CHANGE TO DATABASE) --------------
        teacherData[selectedTeacher].forEach(className => {
            let option = document.createElement("option");
            option.value = className;
            option.textContent = className;
            classDropdown.appendChild(option);
        });

        // Enable class dropdown since a teacher is selected
        classDropdown.disabled = false;
    });

    // Event listener for when a class is selected (table appears)
    classDropdown.addEventListener("change", function () {
        let selectedClass = classDropdown.value;
        students = studentData[selectedClass] || [];

        // Clear table
        attendanceBody.innerHTML = "";

        // Populates student table with name, id, and status columns
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
            // Status button cannot be changed at this point 
            attendanceButton.disabled = true;

            // Event listener for pressing an attendance button
            attendanceButton.addEventListener("click", function () {
                // Checks if manual button is pressed, checks other listener
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
        attendanceTaken = false;
        attendanceStatus.textContent = "Attendance Status: Not Started";
    });

    //  Event listener for manual attendance
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

     // Event listener for auto attendance
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
        let results = [];

        // Gets student and attendance status
        document.querySelectorAll("#attendanceBody tr").forEach(row => {
            let student = row.children[0].textContent;
            let status = row.children[2].children[0].textContent;

            // Pushes results to console for now (ADD LOGIC EVENTUALLY) ----------------------------
            results.push({ student, status });
        });

        // Prints attendance in console
        console.log("Exported Attendance Data:", results);
        alert("Attendance data exported (Check Console).");
    });

    // Event listener to go back to upload page from attendance page
    backToUpload.addEventListener("click", function () {
        authPage.style.display = "none";
        uploadPage.style.display = "block";
        attendancePage.style.display = "none";
    });
});