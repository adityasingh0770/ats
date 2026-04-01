import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { topicIcon, shapeIcon, formatTopicName, formatShapeName, topicColor } from '../utils/masteryCalc';
import { Zap, Lock, ArrowRight } from 'lucide-react';
import { getDashboard } from '../services/quizService';
import {
  TOPIC_ORDER,
  SHAPES_BY_TOPIC,
  getLastUnlockedTopicIndex,
  unlockHintForTopic,
} from '../utils/topicProgression';
import { FullPageLoader } from '../components/ui/LoadingSpinner';

const topicData = TOPIC_ORDER.map((topic) => ({
  topic,
  shapes: SHAPES_BY_TOPIC[topic],
}));

export default function TopicSelectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conceptProgress, setConceptProgress] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDashboard();
        if (!cancelled) setConceptProgress(data.conceptProgress || {});
      } catch {
        if (!cancelled) setConceptProgress({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lastUnlockedIdx = getLastUnlockedTopicIndex(conceptProgress);

  if (loading) return <FullPageLoader text="Loading your path…" />;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-2xl font-black text-[#111111]">Your learning path</h1>
          <p className="text-[#888888] text-xs leading-relaxed max-w-xl">
            Topics unlock in order: <span className="text-[#444444] font-semibold">Perimeter → Area → Surface area → Volume</span>.
            Finish each topic (average mastery across all three shapes) to open the next.
          </p>
        </motion.div>

        <ol className="space-y-3 list-none">
          {topicData.map((t, topicIdx) => {
            const TopicIcon = topicIcon(t.topic);
            const accent = topicColor(t.topic);
            const unlocked = topicIdx <= lastUnlockedIdx;
            const hint = unlockHintForTopic(t.topic);

            return (
              <motion.li
                key={t.topic}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: topicIdx * 0.06 }}
                className={`rounded-2xl border overflow-hidden transition-shadow ${
                  unlocked ? 'border-[#E8E5E0] bg-white shadow-sm' : 'border-[#ECEAE6] bg-[#FAFAF9] opacity-[0.92]'
                }`}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 border-b ${
                    unlocked ? 'border-[#F0EDE8] bg-[#FAFAF9]' : 'border-transparent'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: unlocked ? `${accent}18` : '#E8E5E0' }}
                  >
                    {unlocked ? (
                      <TopicIcon className="w-5 h-5" style={{ color: accent }} />
                    ) : (
                      <Lock className="w-4 h-4 text-[#AAAAAA]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-[#AAAAAA] tabular-nums">Step {topicIdx + 1}</span>
                      <h2 className="font-bold text-[#111111] text-sm sm:text-base">{formatTopicName(t.topic)}</h2>
                      {!unlocked && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#AAAAAA]">Locked</span>
                      )}
                    </div>
                    {!unlocked && hint && <p className="text-[11px] text-[#888888] mt-1 leading-snug">{hint}</p>}
                  </div>
                  {unlocked && (
                    <ArrowRight className="w-4 h-4 text-[#CCCCCC] shrink-0 hidden sm:block" aria-hidden />
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {t.shapes.map((shape, shapeIdx) => {
                      const ShapeIcon = shapeIcon(shape);
                      const canStart = unlocked;
                      return (
                        <motion.button
                          key={shape}
                          type="button"
                          disabled={!canStart}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: topicIdx * 0.06 + shapeIdx * 0.03 }}
                          whileHover={canStart ? { scale: 1.03, y: -1 } : {}}
                          whileTap={canStart ? { scale: 0.98 } : {}}
                          onClick={() => canStart && navigate(`/quiz/${t.topic}/${shape}`)}
                          className={`group p-3 rounded-xl flex flex-col items-center gap-1.5 border transition-all min-h-[88px] ${
                            canStart
                              ? 'border-[#E8E5E0] bg-[#F8F6F3] hover:bg-white hover:border-[#D8D4CE] hover:shadow-sm cursor-pointer'
                              : 'border-[#ECEAE6] bg-[#F5F4F2] cursor-not-allowed opacity-60'
                          }`}
                        >
                          <ShapeIcon
                            className={`w-4 h-4 ${canStart ? 'text-[#CCCCCC] group-hover:text-[#888888]' : 'text-[#D0D0D0]'}`}
                          />
                          <span
                            className={`text-[11px] sm:text-xs font-medium text-center leading-tight ${
                              canStart ? 'text-[#888888] group-hover:text-[#444444]' : 'text-[#BBBBBB]'
                            }`}
                          >
                            {formatShapeName(shape)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-start gap-2.5 px-4 py-3 rounded-2xl border border-orange-200 bg-orange-50"
        >
          <Zap className="w-3.5 h-3.5 text-[#FF6500] shrink-0 mt-0.5" />
          <p className="text-xs text-[#666666] leading-relaxed">
            <span className="text-[#FF6500] font-semibold">Path tip:</span> complete all three shapes in a topic to build
            average mastery; then the next topic opens automatically.
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
