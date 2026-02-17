import React from 'react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const app = useApp() || {};
  const { user = { name: 'System Admin' }, toggleSidebar = () => {} } = app;

  return (
    <header className="bg-white shadow">
      <div className="px-6 py-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className="text-gray-600">
          ☰
        </button>
        <h2 className="text-xl font-semibold">Sofa Factory Manager</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name || 'Admin'}</span>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>
    </header>
  );
}
