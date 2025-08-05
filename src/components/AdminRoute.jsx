import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from './Layout';

export const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />; // Or show a "Not Authorized" page
  }

  // If user is logged in and is an admin, render the content
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};