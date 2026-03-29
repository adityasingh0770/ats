import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { topicIcon, shapeIcon, formatTopicName, formatShapeName, classifyMastery, topicColor } from '../../utils/masteryCalc';
import { ChevronRight } from 'lucide-react';

export default function TopicCard({ topic, shapes, index }) {
  const navigate = useNavigate();
  const accent = topicColor(topic);
  const overall = Object.values(shapes).reduce((s, v) => s + v.score, 0) / Object.keys(shapes).length;
  const TopicIcon = topicIcon(topic);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="card card-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${accent}15` }}>
            <TopicIcon className="w-4 h-4" style={{ color: accent }} />
          </div>
          <span className="text-sm font-bold text-[#111111]">{formatTopicName(topic)}</span>
          <Badge label={classifyMastery(overall)} type={classifyMastery(overall)} size="xs" />
        </div>
        <span className="text-sm font-black text-[#111111]">{Math.round(overall * 100)}%</span>
      </div>

      <div className="space-y-1">
        {Object.entries(shapes).map(([shape, data]) => {
          const ShapeIcon = shapeIcon(shape);
          const pct = Math.round(data.score * 100);
          return (
            <motion.button key={shape} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/quiz/${topic}/${shape}`)}
              className="w-full group flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#F5F3F0] transition-colors">
              <ShapeIcon className="w-3 h-3 text-[#CCCCCC] group-hover:text-[#888888] shrink-0 transition-colors" />
              <span className="text-xs text-[#888888] group-hover:text-[#444444] w-20 text-left shrink-0 transition-colors">
                {formatShapeName(shape)}
              </span>
              <div className="flex-1 h-1.5 bg-black/6 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.06 + 0.1 }}
                  className="h-full rounded-full" style={{ background: accent }} />
              </div>
              <span className="text-xs text-[#AAAAAA] w-7 text-right shrink-0">{pct}%</span>
              <ChevronRight className="w-3 h-3 text-[#DDDDDD] group-hover:text-[#FF6500] shrink-0 transition-colors" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
