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

export default function FeedbackBox({ feedback, onNext, onRetry, canRetry, onRequestEndSession }) {
  if (!feedback) return null;
  const { action, message } = feedback;
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

        <div className="space-y-2 pt-1">
          {canRetry && !isCorrect && !isFinished && onRetry && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={onRetry} className="btn-primary w-full justify-center py-3 text-sm font-bold">
              <RotateCcw className="w-4 h-4" /> Try Again
            </motion.button>
          )}
          {onNext && (
            isCorrect || isFinished ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={onNext} className="btn-primary w-full justify-center py-3 text-sm font-bold">
                {isFinished ? 'See Results' : 'Next Question'}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="pt-2 border-t border-black/5">
                <p className="text-[10px] text-[#AAAAAA] text-center mb-2">Need to stop? This ends your whole session.</p>
                <button
                  type="button"
                  onClick={() => onRequestEndSession?.()}
                  className="w-full text-[11px] text-[#AAAAAA] hover:text-red-600 border border-dashed border-[#E0DDD8] hover:border-red-200 rounded-xl py-2.5 px-3 transition-colors bg-[#FAFAF9] hover:bg-red-50">
                  End session…
                </button>
              </div>
            )
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
