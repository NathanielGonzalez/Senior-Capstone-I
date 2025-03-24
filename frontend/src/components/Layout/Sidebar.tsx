import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  AreaChart, 
  BookOpen, 
  CalendarFoldIcon, 
  Settings, 
  LayoutDashboardIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Assets
import Logo from '../../assets/icons/HeaderTestLogo.svg?url';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Attendance', href: '/attendance', icon: CalendarFoldIcon },
  { name: 'Lorem Ipsum', href: '/lorem', icon: AreaChart },
];

const accountNav = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Attendify Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-gray-900">Attendify.</span>
          </Link>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col px-4 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">Menu</p>
        <ul className="mt-2 space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                    'group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-all'
                  )
                }
              >
                {/* If string (image path), use <img> */}
                {typeof item.icon === 'string' ? (
                  <img src={item.icon} alt={item.name} className="h-5 w-5" />
                ) : (
                  <item.icon className="h-5 w-5 shrink-0" />
                )}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <hr className='mt-4 border-1'/>

        {/* Account Section */}
        <p className="mt-6 text-xs font-semibold text-gray-500 uppercase">Account</p>
        <ul className="mt-2 space-y-1">
          {accountNav.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    isActive
                      ? 'bg-gray-100 text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                    'group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-all'
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      </div>
    </div>
  );
};

export default Sidebar;