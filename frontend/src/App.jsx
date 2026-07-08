import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentComplaints from './pages/student/StudentComplaints';
import StudentFees from './pages/student/StudentFees';
import StudentMessMenu from './pages/student/StudentMessMenu';
import StudentProfile from './pages/student/StudentProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRooms from './pages/admin/AdminRooms';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminFees from './pages/admin/AdminFees';
import AdminMessMenu from './pages/admin/AdminMessMenu';

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
    // Redirect students and admins appropriately
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
          <Route path="/register" element={<Register />} />

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
            path="/student/fees" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentFees />
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
            path="/admin/fees" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminFees />
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
