import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sigma, ListOrdered } from 'lucide-react';

const levelCfg = {
  1: { icon: Lightbulb,   label: 'Concept Hint',  bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-[#FF6500]' },
  2: { icon: Sigma,       label: 'Formula Hint',  bg: 'bg-teal-50',    border: 'border-teal-200',   text: 'text-teal-700',   dot: 'bg-teal-500'  },
  3: { icon: ListOrdered, label: 'Step-by-Step',  bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
};
const dotColors = ['bg-[#FF6500]', 'bg-teal-500', 'bg-purple-500'];

export default function HintPanel({ hints, currentLevel, maxLevel = 3 }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#888888]">Hints (auto-triggered)</span>
        <div className="flex gap-1">
          {[0, 1, 2].map(l => (
            <div key={l} className={`w-5 h-1.5 rounded-full transition-colors ${l < currentLevel ? dotColors[l] : 'bg-black/8'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hints.map((hint, i) => {
          const c = levelCfg[i + 1] || levelCfg[1];
          const HintIcon = c.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
              className={`overflow-hidden rounded-2xl border p-3 ${c.bg} ${c.border}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <HintIcon className={`w-3 h-3 ${c.text}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${c.text}`}>{c.label}</span>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{hint}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
