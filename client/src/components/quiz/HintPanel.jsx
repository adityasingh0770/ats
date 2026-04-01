import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const dotColors = ['bg-[#FF6500]', 'bg-teal-500', 'bg-purple-500'];

export default function HintPanel({ hints, currentLevel, maxLevel = 3 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#888888]">Hints for your answer</span>
        <div className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((l) => (
            <div
              key={l}
              className={`w-5 h-1.5 rounded-full transition-colors ${l < currentLevel ? dotColors[l] : 'bg-black/8'}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hints.map((hint, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-[#E8E5E0] bg-[#FFFBF7] p-3"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-3 h-3 text-[#FF6500]" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#555555]">
                Hint {i + 1} of {maxLevel}
              </span>
            </div>
            <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{hint}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
