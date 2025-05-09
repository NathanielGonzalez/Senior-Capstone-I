import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assets
import GoogleIcon from '../../assets/icons/google.svg';
import WorkdayIcon from '../../assets/icons/workday.svg';

// Components
import Header from '../../components/Header';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const session = localStorage.getItem('auth_token');
      if (session) {
        navigate("/settings", { replace: true });
      }
    }; 
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
//cant have hashtag
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/student/login`, {
        email:email,
        password:password,
      });

      if (response.data.success) {
        localStorage.setItem('auth_token', response.data.token);
        navigate('/settings', { replace: true });
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="h-screen flex flex-col items-center justify-start bg-gray-50 py-32 px-4 sm:px-6 lg:px-8 space-y-4 overflow-hidden">
        <div className='max-w-md w-full space-y-6'>
          <h2 className='text-center text-4xl font-bold'>Sign In.</h2>
        </div>
        
        <div className='w-1/2'>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <div className='flex flex-col'>
              <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                placeholder="E-mail"
                className="w-full px-4 py-2 border border-gray-800 rounded-2xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <label className="mb-1 font-medium text-sm text-gray-700">Password</label>
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-800 rounded-2xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-full shadow-blue-900 shadow-md hover:shadow-md  hover:shadow-blue-700 hover:from-blue-500 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center text-sm">
          <span>Don't have an account? </span>
          <Link to="/signup" className="font-base text-black hover:underline">
            <span className='font-medium'>Create an account</span>
          </Link>
        </div>

        <div className="text-center text-sm font-medium">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;