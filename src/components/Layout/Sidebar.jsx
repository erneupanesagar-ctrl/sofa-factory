import React from 'react';
import { useApp } from '../../contexts/AppContext';

export default function Sidebar() {
  const app = useApp() || {};
  const { sidebarOpen = true, toggleSidebar = () => {} } = app;

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}>
      <div className="p-4">
        <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs'}`}>
          {sidebarOpen ? 'Sofa Factory' : 'SF'}
        </h1>
      </div>
      <nav className="mt-8">
        <a href="#" className="block px-4 py-2 hover:bg-gray-800">Dashboard</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-800">Sales</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-800">Production</a>
        <a href="#" className="block px-4 py-2 hover:bg-gray-800">Inventory</a>
      </nav>
    </aside>
  );
}
