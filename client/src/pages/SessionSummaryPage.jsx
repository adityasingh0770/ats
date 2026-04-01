import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import { MasteryProgress } from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import { classifyMastery, formatTopicName, formatShapeName } from '../utils/masteryCalc';
import {
  CheckCircle2,
  XCircle,
  Home,
  Target,
  Lightbulb,
  Clock,
  Hash,
  TrendingUp,
  AlertCircle,
  ListOrdered,
} from 'lucide-react';

export default function SessionSummaryPage() {
  const location = useLocation();
  const data = location.state;

  if (!data?.summary) {
    return <Navigate to="/dashboard" replace />;
  }

  const { summary, topic, shape, status } = data;
  const s = summary;
  const level = classifyMastery(s.masteryAfter || 0);
  const gainColor = s.masteryGain > 0 ? 'text-green-600' : s.masteryGain < 0 ? 'text-red-500' : 'text-[#AAAAAA]';
  const digest = s.tryDigest;

  const statItems = [
    { label: 'Questions done', value: s.questionsCompleted, icon: Hash, bg: 'bg-slate-50', ic: 'text-slate-600' },
    { label: '1st try correct', value: s.correct, icon: CheckCircle2, bg: 'bg-green-50', ic: 'text-green-600' },
    { label: 'Needed retries', value: s.wrong, icon: XCircle, bg: 'bg-red-50', ic: 'text-red-500' },
    { label: 'Accuracy', value: `${s.accuracy}%`, icon: Target, bg: 'bg-orange-50', ic: 'text-[#FF6500]' },
    { label: 'Total attempts', value: s.totalAttempts, icon: ListOrdered, bg: 'bg-violet-50', ic: 'text-violet-600' },
    { label: 'Hints used', value: s.hintsUsed, icon: Lightbulb, bg: 'bg-amber-50', ic: 'text-amber-500' },
    {
      label: 'Time in quiz',
      value: s.durationMinutes > 0 ? `${s.durationMinutes} min` : '< 1 min',
      icon: Clock,
      bg: 'bg-blue-50',
      ic: 'text-blue-500',
    },
  ];

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-amber-700" />
          </div>
          <h1 className="text-xl font-black text-[#111111]">Session summary</h1>
          <p className="text-xs text-[#888888]">
            {status === 'terminated' ? 'You ended this session early.' : 'Here’s how this session went.'}
          </p>
          <p className="text-sm font-semibold text-[#111111]">
            {formatTopicName(topic)} — {formatShapeName(shape)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card text-center space-y-2 py-5"
        >
          <div className="text-4xl font-black text-[#FF6500]">{s.accuracy}%</div>
          <p className="text-[#888888] text-xs">First-attempt accuracy (this session)</p>
          <Badge label={level} type={level} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-2"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888]">Mastery (this concept)</span>
            <span className={`font-bold ${gainColor} flex items-center gap-1`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {s.masteryGain >= 0 ? '+' : ''}
              {(s.masteryGain * 100).toFixed(1)} pts
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-[#AAAAAA] mb-1">
            <span>Before {(s.masteryBefore * 100).toFixed(0)}%</span>
            <span>After {(s.masteryAfter * 100).toFixed(0)}%</span>
          </div>
          <MasteryProgress score={s.masteryAfter} showBadge={false} />
        </motion.div>

        <div className="grid grid-cols-2 gap-2">
          {statItems.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.label} className={`rounded-xl border border-[#E8E5E0] p-3 ${it.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${it.ic} mb-1`} />
                <div className="text-lg font-black text-[#111111]">{it.value}</div>
                <div className="text-[10px] text-[#888888] leading-tight">{it.label}</div>
              </div>
            );
          })}
        </div>

        {digest?.hasTries && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-[#E8E5E0] bg-[#FAFAF9] p-4"
          >
            <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-2">
              Wrong tries this session ({digest.totalSubmissions})
            </p>
            <ul className="space-y-2 max-h-40 overflow-y-auto text-xs text-[#555555]">
              {digest.tries.map((t) => (
                <li key={t.n} className="flex gap-2 border-b border-black/5 pb-2 last:border-0">
                  <span className="text-[#AAAAAA] shrink-0">#{t.n}</span>
                  <span>
                    <span className="font-mono text-[#111111]">{t.answer}</span>
                    <span className="text-[#888888]"> — {t.kind}</span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link to="/dashboard" className="btn-primary justify-center flex-1 py-3 text-sm">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/topics" className="btn-secondary justify-center flex-1 py-3 text-sm">
            Learning path
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
