import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import TopicSelectPage from './pages/TopicSelectPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import SessionSummaryPage from './pages/SessionSummaryPage';
import ProfilePage from './pages/ProfilePage';
import ChapterEntryPage from './pages/ChapterEntryPage';
import Navbar from './components/layout/Navbar';
import AuthBootstrap from './components/AuthBootstrap';
import { HOME_PATH, CHAPTER_PATH } from './config/routes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path={HOME_PATH} element={<LandingPage />} />
          <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
          <Route path={CHAPTER_PATH} element={<ChapterEntryPage />} />
          <Route path="/login" element={<Navigate to={HOME_PATH} replace />} />
          <Route path="/register" element={<Navigate to={HOME_PATH} replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/topics" element={<TopicSelectPage />} />
          <Route path="/quiz/:topic/:shape" element={<QuizPage />} />
          <Route path="/result/:sessionId" element={<ResultPage />} />
          <Route path="/session-summary" element={<SessionSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
