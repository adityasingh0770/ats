import { motion } from 'framer-motion';
import { classifyMastery } from '../../utils/masteryCalc';

export default function ProgressBar({ value = 0, showLabel = true, color, height = 'h-2', className = '' }) {
  const pct = Math.min(100, Math.max(0, typeof value === 'number' && value <= 1 ? value * 100 : value));
  const barColor = color || (pct < 40 ? '#22C55E' : pct <= 70 ? '#FF6500' : '#8B5CF6');

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-black/6 rounded-full overflow-hidden ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          className={`${height} rounded-full`}
          style={{ background: barColor }}
        />
      </div>
      {showLabel && <div className="text-xs text-[#AAAAAA] mt-0.5">{Math.round(pct)}%</div>}
    </div>
  );
}

export function MasteryProgress({ score = 0, label, showBadge = true }) {
  const level = classifyMastery(score);
  const pct   = Math.round(score * 100);
  const color     = score < 0.4 ? '#22C55E' : score <= 0.7 ? '#FF6500' : '#8B5CF6';
  const textColor = score < 0.4 ? 'text-green-600' : score <= 0.7 ? 'text-orange-600' : 'text-purple-600';
  const badgeBg   = score < 0.4
    ? 'bg-green-100 border-green-200 text-green-700'
    : score <= 0.7
    ? 'bg-orange-100 border-orange-200 text-orange-600'
    : 'bg-purple-100 border-purple-200 text-purple-700';

  return (
    <div className="space-y-1.5">
      {(label || showBadge) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-[#888888]">{label}</span>}
          {showBadge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
              {level}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-black/6 rounded-full overflow-hidden h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          className="h-2 rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="text-xs text-[#AAAAAA]">{pct}% mastery</div>
    </div>
  );
}
