import React from 'react';
import { useApp } from '../contexts/AppContext';

export default function ViewRenderer() {
  const app = useApp() || {};
  const { isAuthenticated = true, user = { name: 'Admin' } } = app;

  if (!isAuthenticated) {
    return <div className="p-8">Please log in to continue.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
      <p className="mt-4 text-gray-600">Sofa Factory Manager Dashboard</p>
    </div>
  );
}
