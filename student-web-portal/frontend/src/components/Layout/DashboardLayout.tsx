import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ViewProfileModal from '../Modals/ViewProfileModal';

const DashboardLayout: React.FC = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="lg:pl-72 flex flex-col w-full">
        <TopBar onOpenProfile={() => setShowProfileModal(true)} />

        <main className="flex-grow bg-[#f3f6fd]">
          <div className="">
            <Outlet />
          </div>
        </main>
        
        <ViewProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;