import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentNoticesSchedules from './pages/student/StudentNoticesSchedules';
import StudentMessMenu from './pages/student/StudentMessMenu';
import StudentProfile from './pages/student/StudentProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRooms from './pages/admin/AdminRooms';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminMessMenu from './pages/admin/AdminMessMenu';
import AdminNoticesSchedules from './pages/admin/AdminNoticesSchedules';

import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === 'ADMIN'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/student/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Student Protected Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/mess"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentMessMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/notices-schedules"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentNoticesSchedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminRooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mess"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminMessMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notices-schedules"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminNoticesSchedules />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2030',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }
        }}
      />
    </AuthProvider>
  );
}
