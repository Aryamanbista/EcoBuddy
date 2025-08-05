import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = () => {
  const { user } = useAuth();

  if (user === null) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace/>; // Or show a "Not Authorized" page
  }

   // If user is authenticated and an admin, render the nested routes
  return <Outlet/>
};