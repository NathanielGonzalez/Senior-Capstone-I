import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder logo - Replace with actual logo if needed
import Logo from '../assets/icons/HeaderTestLogo.svg'; 

const Header: React.FC = () => {
  return (
    <header className="bg-black text-white py-3 px-8 rounded-full mt-4 mx-auto max-w-7xl items-center shadow-xl drop-shadow-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Attendify Logo" className="" />
        </Link>

        {/* Login Button */}
        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-8 py-2 rounded-full">
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
