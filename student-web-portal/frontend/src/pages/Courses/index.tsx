import React from 'react';
import {useState, useEffect} from 'react'
import axios from 'axios'
import { Card, CardContent, Typography, Avatar, Box, Chip, IconButton } from '@mui/material';
import { Call, Message, MoreVert } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const Courses: React.FC = () => {
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
  useEffect(()=>{
    console.log(userCourses)
    console.log(userInfo)
  },[userInfo])
  return (
<Box sx={{ padding: 3, backgroundColor: '#f8faff', minHeight: '100vh' }}>
      
      {/* Header Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome Back, {userInfo.name} 
      </Typography>
      <Typography variant="body2" color="gray">
        Here’s an overview of your course
      </Typography>

      {/* Grid Layout for Course Overview & Upcoming Class */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }} gap={3} marginTop={2}>

        {/* Left Section - Course Overview */}
        <Box>
          {/* Profile Overview */}
          <Card sx={{ padding: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar 
              src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1742262983~exp=1742266583~hmac=9ed19592c8d693197426bc15c4bd59284f5bbaf0a61fe03295f33e4ea71aa0df&w=826"
              sx={{ width: 56, height: 56 }} 
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">English Literature</Typography>
              <Chip label="Class in 45 min" color="primary" size="small" />
            </Box>
            <Box flexGrow={1} />
            <IconButton><Call /></IconButton>
            <IconButton><Message /></IconButton>
            <IconButton><MoreVert /></IconButton>
          </Card>

          {/* Course Result Progress */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Course Result
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            {
            // [
            //   { subject: "Literature", status: "Due", value: null },
            //   { subject: "Geography", value: 89 },
            //   { subject: "History", value: 78 },
            //   { subject: "Algebra", value: 91, highlight: true },
            //   { subject: "Biology", value: 65 }
            // ]
            userCourses.map((course, index) => (
              <Box key={index} textAlign="center">
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 100, 
                    borderRadius: "10px", 
                    backgroundColor: course.highlight ? "purple" : "#eee", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: course.highlight ? "white" : "black",
                    fontWeight: "bold"
                  }}>
                  {course.value ? `${course.value}%` : course.name}
                </Box>
                <Typography variant="body2">{course.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Section - Upcoming Class */}
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Upcoming Class
          </Typography>
          <Card sx={{ padding: 2 }}>
            {
            // [
            //   { title: "Cloud Computing Essentials", time: "5:30 PM", icon: "📦" },
            //   { title: "Mobile App Development Trends", time: "2:08 PM", icon: "✅" },
            //   { title: "Mobile App Development Trends", time: "2:08 PM", icon: "✅" },
            //   { title: "Mobile App Development Trends", time: "2:08 PM", icon: "✅" },
            // ]
            userCourses.map((classItem, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2, padding: 1, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography fontSize={24}>{classItem.icon}</Typography>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{classItem.title}</Typography>
                    <Typography variant="body2" color="gray">{classItem.time}</Typography>
                  </Box>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
            ))}
          </Card>
        </Box>

      </Box>

    </Box>
  );
};

export default Courses;