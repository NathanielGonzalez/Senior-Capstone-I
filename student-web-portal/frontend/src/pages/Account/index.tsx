import React from 'react';

const Account: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Account
          </h2>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <p className="text-gray-500">Account settings coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Account;