import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Skills from './pages/Skills';
import FindPartners from './pages/FindPartners';
import SentRequests from './pages/SentRequests';
import ReceivedRequests from './pages/ReceivedRequests';
import Connections from './pages/Connections';
import Settings from './pages/Settings';
import StudentProfile from './pages/StudentProfile';
import Notifications from './pages/Notifications';

const AppLayout = () => (
  <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
    <Sidebar />
    <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }} className="lg:pt-0 pt-14">
      <Outlet />
    </main>
  </div>
);

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/profile"            element={<Profile />} />
          <Route path="/skills"             element={<Skills />} />
          <Route path="/find-partners"      element={<FindPartners />} />
          <Route path="/sent-requests"      element={<SentRequests />} />
          <Route path="/received-requests"  element={<ReceivedRequests />} />
          <Route path="/connections"        element={<Connections />} />
          <Route path="/notifications"     element={<Notifications />} />
          <Route path="/settings"           element={<Settings />} />
          <Route path="/students/:id"       element={<StudentProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
