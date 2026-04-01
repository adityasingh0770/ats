import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { completeSession } from '../services/quizService';
import PageWrapper from '../components/layout/PageWrapper';
import { MasteryProgress } from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import { FullPageLoader } from '../components/ui/LoadingSpinner';
import { classifyMastery, formatTopicName, formatShapeName } from '../utils/masteryCalc';
import { CheckCircle2, XCircle, Home, RotateCcw, TrendingUp, Target, Lightbulb, Clock, Award, Hash } from 'lucide-react';

export default function ResultPage() {
  const { sessionId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await completeSession(sessionId);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId]);

  if (loading) return <FullPageLoader text="Calculating your results..." />;
  if (!result) return (
    <PageWrapper className="flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-3 text-sm">Could not load results.</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </PageWrapper>
  );

  const { summary, topic, shape } = result;
  const masteryGain = summary.masteryGain || 0;
  const level = classifyMastery(summary.masteryAfter || 0);
  const gainColor = masteryGain > 0 ? 'text-green-600' : masteryGain < 0 ? 'text-red-500' : 'text-[#AAAAAA]';

  const statItems = [
    { label: 'Questions',   value: summary.questionsCompleted, icon: Hash,        bg: 'bg-gray-50',   ic: 'text-[#888888]' },
    { label: '1st Try ✓',  value: summary.correct,            icon: CheckCircle2, bg: 'bg-green-50',  ic: 'text-green-600' },
    { label: 'Retried',    value: summary.wrong,              icon: XCircle,     bg: 'bg-red-50',    ic: 'text-red-500' },
    { label: 'Accuracy',   value: `${summary.accuracy}%`,    icon: Target,      bg: 'bg-orange-50', ic: 'text-[#FF6500]' },
    { label: 'Hints',      value: summary.hintsUsed,          icon: Lightbulb,   bg: 'bg-amber-50',  ic: 'text-amber-500' },
    { label: 'Time',       value: `${summary.durationMinutes}m`, icon: Clock,    bg: 'bg-blue-50',   ic: 'text-blue-500' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-[#FFD700] shadow-md">
              <Award className="w-7 h-7 text-black fill-black" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black text-[#111111]">Session Complete!</h1>
          <p className="text-[#888888] text-xs">{formatTopicName(topic)} — {formatShapeName(shape)}</p>
        </motion.div>

        {/* Accuracy */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card text-center space-y-2 py-5">
          <div className="text-4xl font-black text-[#FF6500]">{summary.accuracy}%</div>
          <p className="text-[#888888] text-xs">First-attempt accuracy</p>
          <Badge label={level} type={level} />
        </motion.div>

        {/* Mastery change */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card space-y-3">
          <h3 className="font-semibold text-[#111111] text-xs flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#FF6500]" /> Mastery Update
          </h3>
          <MasteryProgress score={summary.masteryAfter || 0} label={`${formatTopicName(topic)} — ${formatShapeName(shape)}`} />
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#AAAAAA]">Before: {Math.round((summary.masteryBefore || 0) * 100)}%</span>
            <span className={`font-bold ${gainColor}`}>
              {masteryGain > 0 ? '+' : ''}{Math.round(masteryGain * 100)}% change
            </span>
            <span className="text-[#AAAAAA]">After: {Math.round((summary.masteryAfter || 0) * 100)}%</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-2">
          {statItems.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className={`card text-center py-3 space-y-1.5 ${s.bg}`}>
                <Icon className={`w-4 h-4 mx-auto ${s.ic}`} />
                <div className={`text-base font-black ${s.ic}`}>{s.value}</div>
                <div className="text-xs text-[#AAAAAA]">{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Wrong tries this session (aggregated) */}
        {summary.tryDigest?.hasTries && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
            className="card bg-[#FAFAF9] border-[#E8E5E0] space-y-2">
            <h3 className="font-semibold text-[#111111] text-xs">Your wrong submissions (this session)</h3>
            <ul className="space-y-1.5 max-h-36 overflow-y-auto text-[11px] text-[#555555]">
              {summary.tryDigest.tries.map((t) => (
                <li key={t.n} className="flex flex-wrap gap-x-2 border-b border-black/5 pb-1.5 last:border-0">
                  <span className="text-[#AAAAAA]">#{t.n}</span>
                  <span className="font-mono text-[#111111]">{t.answer}</span>
                  <span className="text-[#888888]">{t.kind}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Question breakdown */}
        {result.questionResults && result.questionResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="card space-y-1.5">
            <h3 className="font-semibold text-[#111111] text-xs mb-2">Question Breakdown</h3>
            {result.questionResults.map((qr, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F0EDE8] last:border-0">
                <div className="flex items-center gap-2">
                  {qr.correct
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  <span className="text-xs text-[#888888]">Q{i + 1}</span>
                  {qr.hintsUsed > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-500">
                      <Lightbulb className="w-3 h-3" />×{qr.hintsUsed}
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#AAAAAA]">
                  {qr.attempts} attempt{qr.attempts !== 1 ? 's' : ''} · {qr.timeSpent}s
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex gap-2">
          <Link to="/dashboard" className="flex-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full btn-secondary flex items-center justify-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Dashboard
            </motion.button>
          </Link>
          <Link to={`/quiz/${topic}/${shape}`} className="flex-1">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Practice Again
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
