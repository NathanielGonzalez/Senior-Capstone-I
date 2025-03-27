import React from 'react';
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
} from 'chart.js';
import { Card, CardContent, Typography, IconButton, Box, CircularProgress, Divider } from '@mui/material';
import { MoreVert } from '@mui/icons-material';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

// Placeholder Data
// Attendance Data
const attendanceData = {
  labels: ['10 Oct', '12 Oct', '14 Oct', '16 Oct', '18 Oct', '20 Oct', '22 Oct'],
  datasets: [
    {
      label: 'Absent',
      data: [20, 18, 22, 25, 21, 23, 19],
      borderColor: 'rgb(255, 87, 34)',
      backgroundColor: 'rgba(255, 87, 34, 0.2)',
      tension: 0.3,
    },
    {
      label: 'Present',
      data: [30, 35, 28, 33, 37, 31, 36],
      borderColor: 'rgb(33, 150, 243)',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      tension: 0.3,
    },
  ],
};

// Performance Data
const performanceData = {
  labels: ['2017', '2018', '2019', '2020', '2021', '2022'],
  datasets: [
    {
      label: 'Performance',
      data: [500, 600, 700, 800, 600, 750],
      backgroundColor: 'rgb(33, 150, 243)',
    },
  ],
};


const Dashboard: React.FC = () => {
const [userInfo, setUserInfo] = useState({})
const [userCourses, setUserCourses] = useState([])
useEffect(()=>{
  const checkUser = async () => {
    const tok = localStorage.getItem('auth_token');
    const user = await axios.post('https://capstoneserver-puce.vercel.app/studentInfo', {
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
  console.log(userInfo)
},[userInfo])

  return (
    <Box sx={{ paddingX: 4, pt: 4, backgroundColor: '#f8faff', minHeight: '100vh' }}>
      {/* Header Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome back, {userInfo.name}.
      </Typography>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }} gap={2}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-indigo-500 rounded-md p-3">
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{userCourses.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-green-500 rounded-md p-3">
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Attendance</dt>
                    <dd className="text-3xl font-semibold text-gray-900">92%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-500 rounded-md p-3">
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Classes</dt>
                    <dd className="text-3xl font-semibold text-gray-900">3</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }} gap={2} className="mt-4">
        
        {/* Attendance Chart */}
        <Card sx={{ padding: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">Attendance</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>Week</Typography>
          </Box>
          <CardContent>
            <Line data={attendanceData} />
          </CardContent>
        </Card>

        {/* My Planning Section */}
        <Card sx={{ padding: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">My Planning</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>Week</Typography>
          </Box>
          <CardContent>
            {["3D Animation Conference", "Handle UX Research", "Machine Learning Lesson", "3D Animation Conference"].map((event, index) => (
              <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(45deg, #FF6FD8, #3813C2)" }} />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{event}</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>December {14 + index * 4}, 10:30 PM</Typography>
                  </Box>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" justifyContent="flex-start" sx={{ width: "66%", maxWidth: "900px", mt: 3, mb: 3 }}>
        <Divider sx={{ flexGrow: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} />
      </Box>
      
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }} gap={2} marginTop={2}>
        
        {/* Performance Section */}
        <Card sx={{ padding: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">Performance</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>Monthly</Typography>
          </Box>
          <CardContent>
            <Bar data={performanceData} />
          </CardContent>
        </Card>

        {/* Course Activities Section */}
        <Card sx={{ padding: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">Course Activities</Typography>
          <CardContent>
            <CircularProgress
              variant="determinate"
              value={75}
              size={80}
              sx={{ color: "rgb(33, 150, 243)" }}
            />
            <Typography variant="h6" fontWeight="bold">75%</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>Process In Progress</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;