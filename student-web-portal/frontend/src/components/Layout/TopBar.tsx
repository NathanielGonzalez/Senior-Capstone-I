import React from 'react';
import { Menu, MenuItem, IconButton, Avatar, Badge } from '@mui/material';
import { Notifications, Mail } from '@mui/icons-material';

interface TopBarProps {
  onOpenProfile: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenProfile }) => {
  // State fpr the dropdown menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // State for the profile modal

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }
  const handleLogout = () => {
    setAnchorEl(null);
      // Remove auth_token from localStorage
  localStorage.removeItem('auth_token');

  // Redirect to the base page (assuming base page is "/")
  window.location.href = '/'; // Or use navigate() if you're using React Router
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Empty div to push content to right */}
      <div className="flex flex-1" />
      
      {/* Icons & Profile */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        
        {/* Notifications Icon with Badge */}
        <IconButton color="default">
          <Badge badgeContent={0} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Vertical Divider */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

        {/* Profile Avatar - Click to Open Menu */}
        <IconButton onClick={handleMenuClick} size="small">
          <Avatar 
            alt="Name Here" 
            src="https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1742262983~exp=1742266583~hmac=9ed19592c8d693197426bc15c4bd59284f5bbaf0a61fe03295f33e4ea71aa0df&w=826"
          />
        </IconButton>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              setTimeout(() => onOpenProfile(), 100); // avoid MUI focus conflict
            }}
          >
            View Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>Edit Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;