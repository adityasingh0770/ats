import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { topicIcon, shapeIcon, formatTopicName, formatShapeName, topicColor } from '../utils/masteryCalc';
import { Zap } from 'lucide-react';

const topicData = [
  { topic: 'perimeter',    shapes: ['square', 'rectangle', 'circle'] },
  { topic: 'area',         shapes: ['square', 'rectangle', 'circle'] },
  { topic: 'surface_area', shapes: ['cube', 'cuboid', 'cylinder']    },
  { topic: 'volume',       shapes: ['cube', 'cuboid', 'cylinder']    },
];

export default function TopicSelectPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
          <h1 className="text-2xl font-black text-[#111111]">Choose a Topic</h1>
          <p className="text-[#888888] text-xs">Select a topic and shape to start an adaptive quiz session</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {topicData.map((t, topicIdx) => {
            const TopicIcon = topicIcon(t.topic);
            const accent = topicColor(t.topic);
            return (
              <motion.div key={t.topic}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: topicIdx * 0.07 }}
                className="card space-y-3">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}15` }}>
                      <TopicIcon className="w-4.5 h-4.5" style={{ color: accent }} />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#111111] text-sm">{formatTopicName(t.topic)}</h2>
                      <p className="text-xs text-[#AAAAAA]">{t.shapes.length} shapes</p>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-0.5 rounded-full font-medium border bg-white"
                    style={{ color: accent, borderColor: `${accent}40` }}>
                    3 levels
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {t.shapes.map((shape, shapeIdx) => {
                    const ShapeIcon = shapeIcon(shape);
                    return (
                      <motion.button key={shape}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: topicIdx * 0.07 + shapeIdx * 0.04 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate(`/quiz/${t.topic}/${shape}`)}
                        className="group p-3 rounded-xl flex flex-col items-center gap-1.5 border border-[#E8E5E0] bg-[#F8F6F3] hover:bg-white hover:border-[#D8D4CE] hover:shadow-sm transition-all">
                        <ShapeIcon className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#888888] transition-colors" />
                        <span className="text-xs text-[#888888] font-medium text-center group-hover:text-[#444444] transition-colors">
                          {formatShapeName(shape)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50">
          <Zap className="w-3.5 h-3.5 text-[#FF6500] shrink-0" />
          <p className="text-xs text-[#666666]">
            <span className="text-[#FF6500] font-semibold">Pro tip:</span> Difficulty auto-adjusts to your current mastery level for each concept.
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
