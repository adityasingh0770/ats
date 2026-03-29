import { motion } from 'framer-motion';
import { topicIcon, formatTopicName, formatShapeName, topicColor } from '../../utils/masteryCalc';
import { Clock, Target, Minus, XCircle } from 'lucide-react';

export default function SessionHistory({ sessions = [] }) {
  return (
    <div className="space-y-1">
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <Minus className="w-6 h-6 text-[#CCCCCC] mx-auto mb-2" />
          <p className="text-xs text-[#AAAAAA]">No sessions yet — start practising!</p>
        </div>
      ) : (
        sessions.slice(0, 8).map((s, i) => {
          const TopicIcon   = topicIcon(s.topic);
          const accent      = topicColor(s.topic);
          const isTerminated = s.status === 'terminated';

          const gain      = s.masteryGain ?? 0;
          const gainColor = isTerminated
            ? 'text-[#AAAAAA]'
            : gain > 0 ? 'text-green-600' : gain < 0 ? 'text-red-500' : 'text-[#AAAAAA]';
          const gainStr   = isTerminated
            ? '—'
            : gain > 0 ? `+${(gain * 100).toFixed(1)}%` : gain < 0 ? `${(gain * 100).toFixed(1)}%` : '—';

          // metrics come nested under s.metrics from the dashboard API
          const correct  = s.metrics?.correct ?? 0;
          const total    = s.questionsCompleted ?? 0;
          const accuracy = total > 0 ? Math.round((correct / total) * 100) : null;
          const timeSecs = s.metrics?.timeSpent ?? 0;

          return (
            <motion.div key={s.sessionId || i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[#F5F3F0] transition-colors">

              {/* Topic icon */}
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: isTerminated ? '#F5F3F0' : `${accent}15` }}>
                <TopicIcon className="w-3.5 h-3.5" style={{ color: isTerminated ? '#BBBBBB' : accent }} />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-[#444444] truncate">
                    {formatTopicName(s.topic)} · {formatShapeName(s.shape)}
                  </p>
                  {isTerminated && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-500 shrink-0">
                      <XCircle className="w-2.5 h-2.5" /> Terminated
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {accuracy !== null && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#AAAAAA]">
                      <Target className="w-2.5 h-2.5" />{accuracy}%
                    </span>
                  )}
                  {timeSecs > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#AAAAAA]">
                      <Clock className="w-2.5 h-2.5" />{Math.round(timeSecs / 60)}m
                    </span>
                  )}
                  {total > 0 && (
                    <span className="text-[10px] text-[#AAAAAA]">{correct}/{total} correct</span>
                  )}
                </div>
              </div>

              {/* Mastery gain */}
              <span className={`text-xs font-bold shrink-0 ${gainColor}`}>{gainStr}</span>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
