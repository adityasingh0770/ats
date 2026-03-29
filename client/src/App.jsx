import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TopicSelectPage from './pages/TopicSelectPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/layout/Navbar';
import { HOME_PATH } from './config/routes';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path={HOME_PATH} element={<LandingPage />} />
          <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/topics" element={<ProtectedRoute><TopicSelectPage /></ProtectedRoute>} />
          <Route path="/quiz/:topic/:shape" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/result/:sessionId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
