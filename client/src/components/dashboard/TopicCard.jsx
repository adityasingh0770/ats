import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { topicIcon, shapeIcon, formatTopicName, formatShapeName, classifyMastery, topicColor } from '../../utils/masteryCalc';
import { ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { completedSubtopicCount, subtopicsNeededForNext, SUBTOPIC_DONE_THRESHOLD } from '../../utils/topicProgression';

export default function TopicCard({ topic, shapes, index, locked = false, lockHint, conceptProgress }) {
  const navigate = useNavigate();
  const accent = topicColor(topic);
  const overall = Object.values(shapes).reduce((s, v) => s + v.score, 0) / Object.keys(shapes).length;
  const TopicIcon = topicIcon(topic);

  const doneSoFar = completedSubtopicCount(conceptProgress, topic);
  const needed = subtopicsNeededForNext(topic);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`card ${locked ? 'opacity-80' : 'card-hover'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: locked ? '#E8E5E0' : `${accent}15` }}
          >
            {locked ? (
              <Lock className="w-3.5 h-3.5 text-[#AAAAAA]" />
            ) : (
              <TopicIcon className="w-4 h-4" style={{ color: accent }} />
            )}
          </div>
          <span className="text-sm font-bold text-[#111111]">{formatTopicName(topic)}</span>
          {!locked && <Badge label={classifyMastery(overall)} type={classifyMastery(overall)} size="xs" />}
          {locked && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-[#AAAAAA]">Locked</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!locked && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
              doneSoFar >= needed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {doneSoFar}/{Object.keys(shapes).length} done
            </span>
          )}
          {!locked && <span className="text-sm font-black text-[#111111]">{Math.round(overall * 100)}%</span>}
        </div>
      </div>

      {locked && lockHint && <p className="text-[11px] text-[#888888] mb-3 leading-snug">{lockHint}</p>}

      <div className="space-y-1">
        {Object.entries(shapes).map(([shape, data]) => {
          const ShapeIcon = shapeIcon(shape);
          const pct = Math.round(data.score * 100);
          const shapeDone = data.score >= SUBTOPIC_DONE_THRESHOLD;
          return (
            <motion.button
              key={shape}
              type="button"
              disabled={locked}
              whileHover={locked ? {} : { x: 2 }}
              whileTap={locked ? {} : { scale: 0.98 }}
              onClick={() => !locked && navigate(`/quiz/${topic}/${shape}`)}
              className={`w-full group flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors ${
                locked
                  ? 'cursor-not-allowed opacity-50'
                  : shapeDone
                    ? 'hover:bg-emerald-50'
                    : 'hover:bg-[#F5F3F0]'
              }`}
            >
              {shapeDone && !locked ? (
                <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-500" />
              ) : (
                <ShapeIcon
                  className={`w-3 h-3 shrink-0 transition-colors ${
                    locked ? 'text-[#CCCCCC]' : 'text-[#CCCCCC] group-hover:text-[#888888]'
                  }`}
                />
              )}
              <span
                className={`text-xs w-20 text-left shrink-0 transition-colors ${
                  locked ? 'text-[#BBBBBB]' : shapeDone ? 'text-emerald-700 font-medium' : 'text-[#888888] group-hover:text-[#444444]'
                }`}
              >
                {formatShapeName(shape)}
              </span>
              <div className="flex-1 h-1.5 bg-black/6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.06 + 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: locked ? '#D0D0D0' : shapeDone ? '#10b981' : accent }}
                />
              </div>
              <span className={`text-xs w-7 text-right shrink-0 ${locked ? 'text-[#CCCCCC]' : shapeDone ? 'text-emerald-600' : 'text-[#AAAAAA]'}`}>
                {pct}%
              </span>
              {!locked && (
                <ChevronRight className="w-3 h-3 text-[#DDDDDD] group-hover:text-[#FF6500] shrink-0 transition-colors" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
