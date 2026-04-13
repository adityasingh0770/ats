import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { clearMergeSession, isMergeSession, isRecommendationSent } from '../../store/mergeStore';
import { sendRecommendation } from '../../services/recommendService';
import { LayoutDashboard, BookOpen, LogOut, Zap } from 'lucide-react';
import { HOME_PATH } from '../../config/routes';

export default function Navbar() {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (isMergeSession() && !isRecommendationSent()) {
      const empty = {
        questionsCompleted: 0,
        questionsCorrectTotal: 0,
        wrong: 0,
        correct: 0,
        totalAttempts: 0,
        hintsUsed: 0,
        timeSpentSeconds: 0,
      };
      try {
        await sendRecommendation(empty, 'exited_midway');
      } catch {
        /* still leave the app */
      }
    }
    logout();
    clearMergeSession();
    navigate(HOME_PATH, { replace: true });
  };
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          <Link to={token ? '/dashboard' : HOME_PATH} className="flex items-center gap-2" replace={false}>
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#FFD700]">
              <Zap className="w-3.5 h-3.5 text-black fill-black" />
            </div>
            <span className="font-black text-base tracking-tight text-[#111111]">
              Math<span className="text-[#FF6500]">Mentor</span>
            </span>
          </Link>

          {token ? (
            <div className="flex items-center gap-0.5">
              <NavLink to="/dashboard" icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" active={isActive('/dashboard')} />
              <NavLink to="/topics"    icon={<BookOpen className="w-3.5 h-3.5" />}        label="Practice"  active={isActive('/topics')} />
              <div className="h-4 w-px bg-black/10 mx-2" />

              <Link to="/profile">
                <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  title="My Profile"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-black cursor-pointer bg-[#FFD700]"
                  style={{ outline: isActive('/profile') ? '2px solid #FF6500' : 'none', outlineOffset: '2px' }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </motion.div>
              </Link>
              <span className="text-xs text-[#888888] hidden sm:block ml-1.5 max-w-[72px] truncate">{user?.name}</span>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
                title="Clear saved session on this device and return home"
                className="flex items-center gap-1 text-[#AAAAAA] hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50 ml-1">
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-xs hidden sm:block">Exit</span>
              </motion.button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link to={to}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          active
            ? 'bg-orange-50 text-[#FF6500] border border-orange-200'
            : 'text-[#888888] hover:text-[#111111] hover:bg-black/4'
        }`}>
        {icon}
        <span className="hidden sm:block">{label}</span>
      </motion.div>
    </Link>
  );
}
