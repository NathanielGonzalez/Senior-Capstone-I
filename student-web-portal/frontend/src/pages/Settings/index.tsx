import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings: React.FC = () => {
  const [faceEncoding, setFaceEncoding] = useState<number[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try { 
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error("Token not found in localStorage");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/studentInfo`,
          { user: token },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userInfo = response.data.userInfo;
        console.log('Full user info:', userInfo);

        const encoding = userInfo.face_encoding;
        console.log('Face Encoding:', encoding);

        setFaceEncoding(encoding); // 2. update state
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDownloadFaceModel = () => {
    if (!faceEncoding) {
      alert("No face model data found.");
      return;
    }

    const blob = new Blob([JSON.stringify(faceEncoding, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "face-model.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearFaceData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error("Token not found in localStorage");
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/removefacemodel`,
        {}, // No body needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Face encoding removed for:', response.data.student.name);
      alert('Face data successfully cleared.');
  
      // Reset local state to reflect cleared data
      setFaceEncoding(null);
  
    } catch (error) {
      const errData = error.response ? error.response.data : error.message;
      console.error('Error during face data removal:', errData);
      alert("Failed to clear face data. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Settings
          </h2>
          <p className="text-gray-500">Manage your account settings below:</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">

        {/* Face Recognition */}
        <div className='border-t pt-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Face Recognition</h3>
          <p className="text-sm text-gray-500 mb-4">Configure and manage your facial recognition settings.</p>
          <div className="flex felx-wrap gap-4">
            <button
              onClick={() => navigate('/face-registration')}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Register Face
            </button>
            <button
              onClick={handleDownloadFaceModel}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              View Current Face Model
            </button>
            <button 
              onClick={handleClearFaceData}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            >
              Clear Face Data
            </button>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
          <p className="text-sm text-gray-500 mb-4">Manage how your data and privacy are handled.</p>

          <div className="space-y-2 space-x-10">
            <button className="text-blue-600 hover:underline text-sm">
              ◎ View Face Data Policy
            </button>
            <button className="text-blue-600 hover:underline text-sm">
              ◎ View Consent History
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-500 mb-4">Control how and when you receive notifications.</p>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 transition duration-150"
              />
              <span className="text-sm text-gray-700">Notify me when attendance fails</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 transition duration-150"
              />
              <span className="text-sm text-gray-700">Notify me when face model expires</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                className="appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:bg-blue-600 checked:border-blue-600 transition duration-150"  
              />
              <span className="text-sm text-gray-700">Receive attendance event reminders</span>
            </label>
          </div>
        </div>


      </div>      
    </div>
  );
};

export default Settings;