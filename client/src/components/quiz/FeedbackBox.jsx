import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, RotateCcw } from 'lucide-react';

const configs = {
  correct: {
    icon: CheckCircle2, iconColor: '#16A34A',
    border: 'border-green-200', bg: 'bg-green-50',
    label: 'Correct!', labelColor: 'text-green-700',
  },
  encouragement: {
    icon: AlertTriangle, iconColor: '#D97706',
    border: 'border-amber-200', bg: 'bg-amber-50',
    label: 'Keep going!', labelColor: 'text-amber-700',
  },
  hint: {
    icon: XCircle, iconColor: '#DC2626',
    border: 'border-red-200', bg: 'bg-red-50',
    label: 'Not quite', labelColor: 'text-red-600',
  },
  remedial: {
    icon: XCircle, iconColor: '#DC2626',
    border: 'border-red-200', bg: 'bg-red-50',
    label: 'Let\'s review this concept', labelColor: 'text-red-600',
  },
  next_question: {
    icon: CheckCircle2, iconColor: '#16A34A',
    border: 'border-green-200', bg: 'bg-green-50',
    label: 'Correct!', labelColor: 'text-green-700',
  },
  session_complete: {
    icon: CheckCircle2, iconColor: '#16A34A',
    border: 'border-green-200', bg: 'bg-green-50',
    label: 'Session complete!', labelColor: 'text-green-700',
  },
};

export default function FeedbackBox({ feedback, onNext, onRetry, canRetry }) {
  if (!feedback) return null;
  const { action, message, correct_answer, error_type, hint_suggestion } = feedback;
  const cfg  = configs[action] || configs.encouragement;
  const Icon = cfg.icon;

  const isFinished = action === 'session_complete';
  const isCorrect  = action === 'correct' || action === 'next_question';

  return (
    <AnimatePresence>
      <motion.div key="fb"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        className={`mt-4 rounded-2xl border p-4 space-y-3 ${cfg.bg} ${cfg.border}`}>

        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: cfg.iconColor }} />
          <span className={`text-sm font-bold ${cfg.labelColor}`}>{cfg.label}</span>
        </div>

        {message && <p className="text-sm text-[#555555] leading-relaxed">{message}</p>}

        {correct_answer && !isCorrect && (
          <div className="p-2.5 rounded-xl bg-white border border-[#E8E5E0]">
            <span className="text-[10px] text-[#AAAAAA] block mb-0.5">Correct answer</span>
            <span className="text-sm font-bold text-[#111111]">{correct_answer}</span>
          </div>
        )}
        {error_type && (
          <div className="text-[10px] text-[#AAAAAA] italic">Error type: {error_type.replace(/_/g, ' ')}</div>
        )}
        {hint_suggestion && (
          <p className="text-xs text-[#FF6500] italic">{hint_suggestion}</p>
        )}

        <div className="flex gap-2 pt-1">
          {canRetry && !isCorrect && !isFinished && onRetry && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onRetry} className="btn-secondary flex-1 justify-center py-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Try Again
            </motion.button>
          )}
          {onNext && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onNext} className="btn-primary flex-1 justify-center py-2 text-xs">
              {isFinished ? 'See Results' : isCorrect ? 'Next Question' : 'Skip'}
              <ChevronRight className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
