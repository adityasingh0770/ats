import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const dotColors = ['bg-[#FF6500]', 'bg-teal-500', 'bg-purple-500'];

function builtInWhy(code) {
  const map = {
    no_llm_key:
      'AI hints need GEMINI_API_KEY on the API server (Render → your service → Environment). Save, redeploy, then try again. You can remove OPENAI_API_KEY from env — it is no longer used.',
    gemini_llm_disabled:
      'Gemini is turned off on the server (GEMINI_LLM_DISABLED). You are seeing built-in hints only — no API calls, no rate limits.',
    empty_student_answer: 'Built-in hints are shown because no answer was on file for the AI step.',
    llm_empty_level:
      'Gemini returned empty hint text after retries. Check Render logs and GEMINI_MODEL (try gemini-1.5-flash if 2.0 fails).',
    llm_auth: 'Gemini rejected the key (401/403). Create a new key in Google AI Studio and set GEMINI_API_KEY on Render.',
    llm_error:
      'Gemini request failed. In Render → Logs search for [hints] or [gemini]. Check API key, model name, quota, and region.',
    llm_network: 'Could not reach Google Gemini from the server. Check network / firewall on the host.',
    llm_timeout: 'Gemini took too long. Retry; if it persists, try a smaller GEMINI_MODEL or upgrade hosting.',
    llm_rate_limit:
      'Gemini hit a rate limit (429) just now — built-in hints are shown immediately. For AI hints again, wait a minute or enable pay-as-you-go in Google AI for higher limits.',
    llm_no_cache: 'Hint cache was missing; built-in text was used.',
    fetch_missing:
      'This server has no HTTP client. Use Node 18+ on Render (see package.json engines) and redeploy.',
    // legacy codes from older sessions
    no_openai_key:
      'Set GEMINI_API_KEY on Render (OpenAI is no longer used). Save and redeploy.',
    openai_empty_level:
      'AI returned empty hints. Set GEMINI_API_KEY and check GEMINI_MODEL in Render logs.',
    openai_auth: 'Invalid API key for the AI provider. Use GEMINI_API_KEY from Google AI Studio.',
    openai_error: 'AI request failed. Use GEMINI_API_KEY only; see Render logs.',
    openai_network: 'Network error calling the AI. Check Render connectivity.',
    openai_timeout: 'AI timed out. Retry or adjust GEMINI_MODEL.',
    openai_rate_limit: 'Rate limited. Wait or increase Gemini quota in Google Cloud / AI Studio.',
    openai_no_cache: 'Hint cache missing; using built-in text.',
  };
  return map[code] || 'Built-in hints are used when Gemini is unavailable.';
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
