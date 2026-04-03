import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { topicIcon, shapeIcon, formatTopicName, formatShapeName, topicColor } from '../utils/masteryCalc';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getDashboard } from '../services/quizService';
import {
  TOPIC_ORDER,
  SHAPES_BY_TOPIC,
  getLastUnlockedTopicIndex,
  unlockHintForTopic,
  completedSubtopicCount,
  subtopicsNeededForNext,
  SUBTOPIC_DONE_THRESHOLD,
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
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-[#111111]">Your learning path</h1>
        </motion.div>

        <ol className="space-y-2 list-none">
          {topicData.map((t, topicIdx) => {
            const TopicIcon = topicIcon(t.topic);
            const accent = topicColor(t.topic);
            const unlocked = topicIdx <= lastUnlockedIdx;
            const hint = unlockHintForTopic(t.topic);

            // Progress toward unlocking the next topic
            const doneSoFar = completedSubtopicCount(conceptProgress, t.topic);
            const needed = subtopicsNeededForNext(t.topic);
            const isCurrentlyGating = unlocked && topicIdx === lastUnlockedIdx && doneSoFar < needed;

            return (
              <motion.li
                key={t.topic}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: topicIdx * 0.06 }}
                className={`rounded-xl border overflow-hidden transition-shadow ${
                  unlocked ? 'border-[#E8E5E0] bg-white shadow-sm' : 'border-[#ECEAE6] bg-[#FAFAF9] opacity-[0.92]'
                }`}
              >
                <div
                  className={`flex items-center gap-2.5 px-3 py-2 border-b ${
                    unlocked ? 'border-[#F0EDE8] bg-[#FAFAF9]' : 'border-transparent'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: unlocked ? `${accent}18` : '#E8E5E0' }}
                  >
                    {unlocked ? (
                      <TopicIcon className="w-4 h-4" style={{ color: accent }} />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#AAAAAA]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-[#AAAAAA] tabular-nums">Step {topicIdx + 1}</span>
                      <h2 className="font-bold text-[#111111] text-sm sm:text-base">{formatTopicName(t.topic)}</h2>
                      {!unlocked && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#AAAAAA]">Locked</span>
                      )}
                      {/* Progress pill: show on unlocked topics */}
                      {unlocked && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            doneSoFar >= needed
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {doneSoFar}/{t.shapes.length} done
                        </span>
                      )}
                    </div>
                    {!unlocked && hint && <p className="text-[10px] text-[#888888] mt-0.5 leading-snug">{hint}</p>}
                    {isCurrentlyGating && (
                      <p className="text-[10px] text-amber-600 mt-0.5 leading-snug">
                        Reach 50% mastery in {needed - doneSoFar} more shape{needed - doneSoFar > 1 ? 's' : ''} to unlock the next topic.
                      </p>
                    )}
                  </div>
                  {unlocked && (
                    <ArrowRight className="w-4 h-4 text-[#CCCCCC] shrink-0 hidden sm:block" aria-hidden />
                  )}
                </div>

                <div className="px-2 pb-1.5 pt-0">
                  <div className="grid grid-cols-3 gap-0.5">
                    {t.shapes.map((shape, shapeIdx) => {
                      const ShapeIcon = shapeIcon(shape);
                      const canStart = unlocked;
                      const shapeDone = (conceptProgress?.[t.topic]?.[shape]?.score ?? 0) >= SUBTOPIC_DONE_THRESHOLD;
                      return (
                        <motion.button
                          key={shape}
                          type="button"
                          disabled={!canStart}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: topicIdx * 0.06 + shapeIdx * 0.03 }}
                          whileTap={canStart ? { scale: 0.98 } : {}}
                          onClick={() => canStart && navigate(`/quiz/${t.topic}/${shape}`)}
                          className={`group py-1 px-1 rounded-md flex flex-row items-center justify-center gap-0.5 border transition-colors min-h-0 relative ${
                            canStart
                              ? shapeDone
                                ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                                : 'border-[#E2DFDA] bg-[#F3F1EE] hover:bg-white hover:border-[#C9C5BF] cursor-pointer'
                              : 'border-[#EBE9E6] bg-[#F4F3F1] cursor-not-allowed opacity-60'
                          }`}
                        >
                          {shapeDone && canStart ? (
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0 text-emerald-500" />
                          ) : (
                            <ShapeIcon
                              className={`w-2.5 h-2.5 shrink-0 ${canStart ? 'text-[#999999] group-hover:text-[#555555]' : 'text-[#D0D0D0]'}`}
                            />
                          )}
                          <span
                            className={`text-[9px] font-semibold leading-tight truncate ${
                              canStart
                                ? shapeDone
                                  ? 'text-emerald-700'
                                  : 'text-[#555555] group-hover:text-[#111111]'
                                : 'text-[#BBBBBB]'
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
      </div>
    </PageWrapper>
  );
}
