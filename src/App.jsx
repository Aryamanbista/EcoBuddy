// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { AdminRoute } from './components/AdminRoute';
import { Layout } from './components/Layout';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SchedulePickupPage from './pages/SchedulePickupPage';
import ReportIssuePage from './pages/ReportIssuePage';
import HistoryPage from './pages/HistoryPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';

import { AdminLayout } from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageIssues from './pages/admin/ManageIssues';
import AnnouncePage from './pages/admin/AnnouncePage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManagePickupsPage from './pages/admin/ManagePickupsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}> {/* Gatekeeper for users */}
            <Route element={<Layout />}> {/* Shell for users */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="schedule-pickup" element={<SchedulePickupPage />} />
              <Route path="report-issue" element={<ReportIssuePage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}> {/* Gatekeeper for admins */}
            <Route element={<AdminLayout />}> {/* Shell for admins */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/pickups" element={<ManagePickupsPage />} />
              <Route path="/admin/issues" element={<ManageIssues />} />
              <Route path="/admin/announce" element={<AnnouncePage />} />
            </Route>
          </Route>

          {/* Fallback Route (optional: can redirect to landing or a 404 page) */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;