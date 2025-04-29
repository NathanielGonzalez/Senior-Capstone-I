import React, { useEffect, useRef, useState } from 'react';
import WebCam from 'react-webcam';
import axios from 'axios';
import { 
    Button, Typography, Box, CircularProgress, 
    IconButton, LinearProgress, Card, CardContent 
} from "@mui/material";
import { ArrowBack, CameraAlt, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabaseClient";

const MAX_IMAGES = 10;

const FaceRegistration: React.FC = () => {
    const webcamRef = useRef<WebCam>(null);
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({})
  const [userCourses,setUserCourses] = useState([])
  useEffect(()=>{
    const checkUser = async () => {
      const tok = localStorage.getItem('auth_token');
      const user = await axios.post(`${import.meta.env.VITE_API_URL}/studentInfo`, {
          user:tok
        },
        { headers: { 'Authorization': `Bearer ${tok}` } }
      )
        setUserInfo(user.data.userInfo);
        setUserCourses(user.data.courses);
    };
    checkUser();
  },[])
    // Capture Image from Webcam
    const capture = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc && capturedImages.length < MAX_IMAGES) {
                setCapturedImages((prevImages) => [...prevImages, imageSrc]); // ✅ Correctly updates the array
            }
        }
    };

    // Remove Captured Image
    const deleteImage = (index: number) => {
        setCapturedImages(capturedImages.filter((_, i) => i !== index));
    };

    // Upload Image to Supabase Storage
const handleUpload = async () => {
    if (capturedImages.length === 0) return;
    setUploading(true);

    try {
        // Retrieve the user from your authentication context or state
        const user = userInfo;
        if (!user) throw new Error("User not found or authentication error.");

        const studentId = userInfo.id; // Assuming the user ID corresponds to the student ID
 
        // Create a FormData object
        const formData = new FormData();
        formData.append('student_id', studentId);

        // Append each captured image to the FormData object
        for (let i = 0; i < capturedImages.length; i++) {
            const imageBlob = await fetch(capturedImages[i]).then(res => res.blob());
            formData.append('photo', imageBlob, `image_${i}.png`);
        } 
        
        // Send the POST request to the Flask backend
        const response = await axios.post('http://127.0.0.1:5001/uploadStudentPhoto', formData, {
            
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            // Include credentials/headers as necessary for authentication
        });

        
        if (response.status==200) {
            alert("Images uploaded and processed successfully.");
            navigate("/settings"); // Redirect to dashboard after completion
        } else {
            throw new Error(response.status);
        }
    } catch (error) {
        console.error("Upload Error:", error);
        alert("An error occurred during the upload. Please try again.");
        navigate("/settings");
    } finally {
        setUploading(false);
    }
};

    return (
        <Box sx={{ paddingY: 0, backgroundColor: "#f8faff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}> 
            {/* Header Section */}
            <Box sx={{ width: "100%", maxWidth: "800px", display: "flex", alignItms: "center", justifyContent: "space-between", paddingY: 3, position: "relative"}}>
                {/* Back Button on the left */}
                <IconButton 
                    onClick={() => navigate(-1)} 
                    sx={{ position: "absolute",  left: 0 }}
                >
                    <ArrowBack />
                </IconButton>

                {/* Centered Title and Subtitle */}
                <Box sx={{ textAlign: "center", flexGrow: 1}}>
                    <Typography variant="h5" fontWeight="bold">
                        Face Registration
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "gray", marginTop: 1}}>
                        Please capture an image to register your face.
                    </Typography>
                </Box>
            
            </Box>
            
            {/* Main Content Grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 4, alignItems: "center", justifyContent: "center", marginTop: 3, width: "100%", maxWidth: "900px" }}>
                {/* Webcam View + Capture */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <WebCam
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        style={{ width: "400px", height: "300px", borderRadius: "12px", border: "2px solid #ccc" }}
                    />

                    {/* Capture Button */}
                    <IconButton
                        onClick={capture}
                        disabled={capturedImages.length >= MAX_IMAGES}
                        sx={{ marginTop: 2, backgroundColor: "#1976d2", color: "#fff", "&:hover": { backgroundColor: "#1565c0" } }}
                    >
                        <CameraAlt fontSize="large" />
                    </IconButton>
                </Box>

                {/* Progress Tracker */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Card sx={{ padding: 3, textAlign: "center", backgroundColor: "#000", color: "#fff", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", width: "400px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.6)"  }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#fff"}}>
                            Progress
                        </Typography>
                        
                        {/* Progress Bar */}
                        <LinearProgress 
                            variant="determinate" 
                            value={(capturedImages.length / MAX_IMAGES) * 100} 
                            sx={{ height: 12, borderRadius: 5, my: 2, width: "100%", backgroundColor: "#222", "& .MuiLinearProgress-bar": { backgroundColor: "#fff"} }} 
                        />
                        <Typography variant="body2" sx={{ color: "#fff"}}>
                            {Math.round((capturedImages.length / MAX_IMAGES) * 100)}% Capturing...
                        </Typography>
                    </Card>
                    
                    {/* Continue Button (Only appears when complete) */}
                    {capturedImages.length === MAX_IMAGES && (
                        <Button 
                            variant="contained" 
                            sx={{
                                marginTop: 2,
                                paddingX: 3,
                                paddingY: 1.5,
                                color: "white",
                                backgroundColor: "#007bff",
                                borderRadius: "24px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                transition: "background-color 0.3s ease-in-out",
                                "&:hover": { backgroundColor: "#0056b3" },
                                width: "280px", // Matches the progress tracker width for alignment
                                textAlign: "center",
                            }}
                            onClick={handleUpload}
                        >
                            Continue
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Image Gallery */}
            <Box sx={{ marginTop: 4 }}>
                <Typography 
                    variant="body1"
                    sx={{
                        backgroundColor: "rgba(212, 209, 209, 0.2)",
                        color: "#333",
                        paddingX: 3,
                        paddingY: 1,
                        fontWeight: "bold",
                        borderRadius: "24px",
                        textAlign: "center",
                        width: "fit-content",
                        marginBottom: 2,
                    }}
                >
                    Captured Images
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", padding: 2, borderRadius: "12px", backgroundColor: "rgba(212, 209, 209, 0.2)" }}>
                    {capturedImages.map((image, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                            <img 
                                src={image} 
                                alt={`Captured ${index + 1}`} 
                                style={{ width: "80px", borderRadius: "10px", border: "2px solid #ccc" }} 
                            />
                            <IconButton 
                                onClick={() => deleteImage(index)} 
                                size="small" 
                                sx={{ position: "absolute", top: -5, right: -5, backgroundColor: "white" }}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default FaceRegistration;