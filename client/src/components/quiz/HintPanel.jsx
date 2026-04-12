import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const dotColors = ['bg-[#FF6500]', 'bg-teal-500', 'bg-purple-500'];

export default function HintPanel({ hints, currentLevel, maxLevel = 2 }) {
  const dotCount = Math.max(1, Math.min(maxLevel, 3));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#888888]">Hints</span>
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: dotCount }, (_, idx) => (
            <div
              key={idx}
              className={`w-5 h-1.5 rounded-full transition-colors ${idx < currentLevel ? dotColors[idx] : 'bg-black/8'}`}
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
            <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line flex gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#FF6500] shrink-0 mt-0.5" aria-hidden />
              <span>{hint}</span>
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
