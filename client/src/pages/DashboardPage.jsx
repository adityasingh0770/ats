import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLearnerStore } from '../store/learnerStore';
import { getDashboard } from '../services/quizService';
import PageWrapper from '../components/layout/PageWrapper';
import TopicCard from '../components/dashboard/TopicCard';
import StatsCard from '../components/dashboard/StatsCard';
import SessionHistory from '../components/dashboard/SessionHistory';
import { MasteryProgress } from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import { BookOpen, ArrowRight, RefreshCw, Brain, Zap, Target, PenLine, Lightbulb, Library } from 'lucide-react';
import { TOPIC_ORDER, getLastUnlockedTopicIndex, unlockHintForTopic } from '../utils/topicProgression';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { dashboard, loading, error, setDashboard, setLoading, setError } = useLearnerStore();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!cancelled) await fetchDashboard();
      } catch {
        if (!cancelled) setError('Could not start your session. Refresh and try again.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <FullPageLoader text="Loading your dashboard..." />;

  if (error) return (
    <PageWrapper className="flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchDashboard} className="btn-primary">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    </PageWrapper>
  );

  if (!dashboard) return null;

  const { student, overallMastery, conceptProgress, stats, recentSessions } = dashboard;
  const isNewUser = stats.attempts === 0;

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-[#111111]">
              Hello, {student.name.split(' ')[0]}<span className="text-[#FF6500]">.</span>
            </h1>
          </div>
          <Link to="/topics">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary">
              <BookOpen className="w-3.5 h-3.5" />
              {isNewUser ? 'Start First Quiz' : 'Practice'}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* New user welcome */}
        {isNewUser && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card border-orange-200 bg-orange-50">
            <div className="flex items-start gap-4 flex-wrap">
              <Zap className="w-5 h-5 text-[#FF6500] shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h2 className="text-sm font-bold text-[#111111]">Welcome to MathMentor!</h2>
                <p className="text-[#666666] text-xs leading-relaxed">Start with <strong className="text-[#444444]">Perimeter</strong>—topics unlock in order (Perimeter → Area → Surface area → Volume) as you build mastery.</p>
                <div className="grid sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { icon: Brain,      label: 'Adaptive Questions', desc: 'Difficulty adjusts to your level', bg: 'bg-green-100',  icon_c: 'text-green-600' },
                    { icon: Zap,        label: '3-Level Hints',       desc: 'Never get stuck again',           bg: 'bg-amber-100',  icon_c: 'text-amber-600' },
                    { icon: Target,     label: 'Error Detection',     desc: 'Know exactly what went wrong',    bg: 'bg-blue-100',   icon_c: 'text-blue-600'  },
                  ].map(f => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className={`flex items-start gap-2 p-2.5 rounded-xl ${f.bg} border border-black/6`}>
                        <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${f.icon_c}`} />
                        <div>
                          <div className="text-xs font-semibold text-[#111111]">{f.label}</div>
                          <div className="text-xs text-[#888888]">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mastery + Stats — column on mobile, row on large screens */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch min-w-0 w-full">

          {/* Overall Mastery — full width mobile, ~55% desktop */}
          {!isNewUser && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card py-3 px-4 flex flex-col justify-between w-full min-w-0 lg:flex-[3]">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs font-semibold text-[#111111]">Overall Mastery</p>
                  <p className="text-[9px] text-[#888888]">All topics & shapes</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-[#111111]">{overallMastery.percentage}%</span>
                  <Badge label={overallMastery.level} type={overallMastery.level} />
                </div>
              </div>
              <MasteryProgress score={overallMastery.score} showBadge={false} />
            </motion.div>
          )}

          {/* Stats — 2×2 grid on small screens, one row on lg+ */}
          <div className="grid grid-cols-2 gap-2 w-full min-w-0 lg:flex lg:flex-[2] lg:flex-row lg:gap-2">
            <StatsCard Icon={Target}    title="Accuracy"   value={isNewUser ? '—' : `${stats.accuracy}%`} color="#F43F5E" index={0} subtitle="correct / attempts" />
            <StatsCard Icon={PenLine}   title="Attempts"   value={stats.attempts || '0'}                  color="#FF6500" index={1} subtitle="questions answered" />
            <StatsCard Icon={Lightbulb} title="Hints Used" value={stats.hintsUsed || '0'}                 color="#F59E0B" index={2} subtitle="hints requested" />
            <StatsCard Icon={Library}   title="Sessions"   value={stats.totalSessions || '0'}             color="#3B82F6" index={3} subtitle="quiz sessions" />
          </div>
        </div>

        {/* Topic Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#111111]">Topic Progress</h2>
            {isNewUser && (
              <span className="text-xs text-[#AAAAAA]">Start with Perimeter — other topics unlock as you progress</span>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {TOPIC_ORDER.map((topic, i) => {
              const shapes = conceptProgress[topic] || {};
              const lastUnlocked = getLastUnlockedTopicIndex(conceptProgress);
              const locked = i > lastUnlocked;
              return (
                <TopicCard
                  key={topic}
                  topic={topic}
                  shapes={shapes}
                  index={i}
                  locked={locked}
                  lockHint={locked ? unlockHintForTopic(topic) : null}
                  conceptProgress={conceptProgress}
                />
              );
            })}
          </div>
        </div>

        {/* Error Patterns */}
        {stats.errorPatterns && stats.errorPatterns.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="card border-amber-200 bg-amber-50">
            <h3 className="font-semibold text-amber-700 text-xs mb-2">Common Mistake Patterns</h3>
            <div className="flex flex-wrap gap-1.5">
              {stats.errorPatterns.map(e => (
                <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700">
                  {e.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Sessions */}
        <div>
          <h2 className="text-sm font-bold text-[#111111] mb-3">Recent Sessions</h2>
          <div className="card">
            {isNewUser ? (
              <div className="text-center py-8 space-y-2">
                <Library className="w-6 h-6 mx-auto text-[#CCCCCC]" />
                <p className="text-[#111111] text-xs font-medium">No sessions yet</p>
                <p className="text-[#AAAAAA] text-xs">Complete your first quiz to see history.</p>
                <Link to="/topics">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="btn-primary mt-3">
                    Start First Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
              </div>
            ) : (
              <SessionHistory sessions={recentSessions} />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
