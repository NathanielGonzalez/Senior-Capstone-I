import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabaseClient';
import axios from 'axios'
// Assets
import SignupImage from '../../assets/images/signup-placeholder-image.png';

// Components
import Header from '../../components/Header';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    try {
      // 1. Create user in Supabase Auth

      const response = await axios.post(`https://capstoneserver-puce.vercel.app/student/signup`, {
        password:formData.password,
        studentId: formData.studentId,
        email: formData.email,
        number: formData.phone
      })

      // Log response for debugging


      const userId = response.data.user.id;
      if (!userId) {
        setError('User ID is missing.');
        setLoading(false);
        return;
      }

      // Automatically sign in the user after successful signup
     
      const loginresponse = await axios.post('https://capstoneserver-puce.vercel.app/student/login', {
        email: formData.email,
        password: formData.password,
      }); 

      if (loginresponse.data.success == false) {
        console.error("Auto Login Error:", loginresponse.data.message);
        setError("Account created, but login failed. Please sign in manually.");
        setLoading(false);
        return;
      }

      // Success Alert
      alert('Signup successful! Please check your email for verification.');
      navigate('/face-registration');
  
    } catch (err) {
      console.error("Unexpected Error:", err);
      setError('An unexpected error occurred');
    }
  
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-2 max-w-5xl w-full gap-8">
          
          {/* Left Image Section */}
          <div>
            <img src={SignupImage} alt="Signup Preview" className="rounded-lg shadow-lg w-fit" />
          </div>

          {/* Right Form Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-sm text-gray-500">Learn More About Us</p>

            {error && <p className="text-red-500">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>


              {/* Student ID */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Create password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-2xl"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Terms of Use */}
              <div className="text-xs text-gray-500">Terms of Use</div>

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-full shadow-blue-900 shadow-md hover:shadow-md  hover:shadow-blue-700 hover:from-blue-500 hover:to-blue-700"
              >
                Sign Up.
              </button>

            </form>

            {/* Already have an account? */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-black hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;