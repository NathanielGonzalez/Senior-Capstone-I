import React, { useEffect, useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import supabase from '../../utils/supabaseClient';


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
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigate("/dashboard", { replace: true });
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate the user with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // 2. Save session (optional)
      localStorage.setItem('supabase_session', JSON.stringify(data.session));

      // 3. Redirect user to dashboard after successful login
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError('An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Sign In Form */}
        <div className='max-w-md w-full space-y-6'>
          <h2 className='text-center text-4xl font-bold'>Sign In.</h2>
        </div>
        
        {/* OAuth Buttons */}
        <div className="space-y-4">
            <button 
              type='button'
              className="w-full flex items-center justify-center py-2 px-32 border border-gray-800 rounded-2xl shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 gap-x-4"
            >
              <img src={GoogleIcon} alt="Google" className="h-8 w-8" />
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-2 px-32 border border-gray-800 rounded-2xl shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 gap-x-4"
            >
              <img src={WorkdayIcon} alt="Workday Icon" className="h-8 w-8 mr-2" />
              Continue with Workday
            </button>
        </div>

        <div className="text-center text-black font-bold">or</div>

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
          <span>don't have an account? </span>
          <Link to="/signup" className="font-base text-black hover:underline">
            <span className='font-medium'>Create a account</span>
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