import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layout/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import AssignTestsPage from './pages/AssignTestsPage.jsx';
import ScreeningPage from './pages/ScreeningPage.jsx';
import ConsultationPage from './pages/ConsultationPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <RegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign-tests"
          element={
            <ProtectedRoute roles={['admin', 'receptionist', 'technician']}>
              <AssignTestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/screening"
          element={
            <ProtectedRoute roles={['admin', 'technician']}>
              <ScreeningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultation"
          element={
            <ProtectedRoute roles={['admin', 'doctor']}>
              <ConsultationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute roles={['admin', 'billing']}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

