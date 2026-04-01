import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const dotColors = ['bg-[#FF6500]', 'bg-teal-500', 'bg-purple-500'];

function builtInWhy(code) {
  const map = {
    no_openai_key:
      'AI hints are off: your API server has no usable OPENAI_API_KEY. In Render: open service “ats” → Environment → add the key (or link your env group) → Save → redeploy.',
    empty_student_answer: 'Built-in hints are shown because no answer was on file for the AI step.',
    openai_empty_level:
      'OpenAI returned empty hint text after retries. Check Render logs, model name, and billing; built-in text is used for this level.',
    openai_auth: 'OpenAI rejected the API key (401). Replace the key on Render and redeploy.',
    openai_error: 'The AI hint request failed. See server logs on Render for details.',
    openai_no_cache: 'Hint cache was missing; built-in text was used.',
  };
  return map[code] || 'Built-in hints are being used instead of the AI path.';
}

export default function HintPanel({ hints, hintSources, lastHint, currentLevel, maxLevel = 3 }) {
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

      {lastHint?.source === 'rules' && lastHint?.llmSkippedReason && (
        <p className="text-[10px] text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-snug">
          <span className="font-bold">Why not AI?</span> {builtInWhy(lastHint.llmSkippedReason)}
        </p>
      )}

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
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <Lightbulb className="w-3 h-3 text-[#FF6500]" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#555555]">
                Hint {i + 1} of {maxLevel}
              </span>
              {hintSources?.[i] === 'llm' && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-700 border border-violet-200">
                  AI
                </span>
              )}
              {hintSources?.[i] === 'rules' && (
                <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                  Built-in
                </span>
              )}
            </div>
            <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">{hint}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
