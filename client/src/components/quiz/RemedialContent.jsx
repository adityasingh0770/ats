import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ChevronRight,
  CheckCircle,
  XCircle,
  Sigma,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  List,
  Footprints,
  Bot,
} from 'lucide-react';

function svgToDataUrl(svgMarkup) {
  if (svgMarkup == null || typeof svgMarkup !== 'string') return '';
  let s = svgMarkup.replace(/%23/gi, '#').trim();
  if (!/\sxmlns\s*=/.test(s)) {
    s = s.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

const TABS = [
  { id: 'basics', label: 'Basics', Icon: Sparkles },
  { id: 'visual', label: 'Figures', Icon: ImageIcon },
  { id: 'formula', label: 'Formula', Icon: Sigma },
  { id: 'tries', label: 'Your tries', Icon: Footprints },
];

export default function RemedialContent({ content, onContinue }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [tab, setTab] = useState('basics');
  const [gifFailed, setGifFailed] = useState(false);

  if (!content) return null;

  const simpleQ = content.simpleQuestion || null;
  const digest = content.sessionDigest;
  const figures = content.figures || [];
  const hasVisual = (content.gifUrl && !gifFailed) || figures.length > 0;
  const hasTries = digest?.hasTries;

  const handleSubmit = () => {
    if (!answer.trim() || simpleQ?.answer == null) return;
    const isCorrect = Math.abs(parseFloat(answer) - parseFloat(simpleQ.answer)) < 0.5;
    setCorrect(isCorrect);
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-xl mx-auto px-1 sm:px-0"
    >
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="w-5 h-5 text-[#FF6500]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#FF6500] uppercase tracking-widest">Remedial review</p>
            <h2 className="text-lg font-black text-[#111111] mt-1">{content.title}</h2>
            {content.tagline && <p className="text-sm text-[#555555] mt-1 leading-relaxed">{content.tagline}</p>}
          </div>
        </div>
      </div>

      {/* Gemini AI personal insight */}
      {content.geminiInsight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Your AI tutor says</p>
          </div>
          <p className="text-sm text-[#333333] leading-relaxed">{content.geminiInsight}</p>
        </motion.div>
      )}

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-[#F0EDE8] border border-[#E8E5E0]">
        {TABS.map(({ id, label, Icon }) => {
          if (id === 'visual' && !hasVisual) return null;
          if (id === 'tries' && !hasTries) return null;
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 min-w-[4.5rem] flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                active ? 'bg-white text-[#FF6500] shadow-sm' : 'text-[#888888] hover:text-[#444444]'
              }`}
            >
              <Icon className="w-3 h-3 shrink-0 opacity-80" />
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm p-4 sm:p-5 min-h-[180px]"
        >
          {tab === 'basics' && (
            <div className="space-y-4">
              {content.intro && (
                <p className="text-sm text-[#444444] leading-relaxed font-medium">{content.intro}</p>
              )}
              {Array.isArray(content.basicsBullets) && content.basicsBullets.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <List className="w-3 h-3" /> In the simplest terms
                  </p>
                  <ul className="space-y-2">
                    {content.basicsBullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[#555555] leading-relaxed">
                        <span className="w-5 h-5 rounded-lg bg-[#FF6500]/10 text-[#FF6500] text-xs font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {content.explanation && (
                <div className="pt-2 border-t border-[#F0EDE8]">
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase mb-2">Full idea</p>
                  <p className="text-sm text-[#666666] leading-relaxed whitespace-pre-line">{content.explanation}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'visual' && (
            <div className="space-y-4">
              {content.gifUrl && !gifFailed && (
                <div className="rounded-xl overflow-hidden border border-[#E8E5E0] bg-black/[0.02]">
                  <img
                    src={content.gifUrl}
                    alt=""
                    className="w-full max-h-56 object-contain bg-white"
                    onError={() => setGifFailed(true)}
                  />
                  {content.gifCaption && (
                    <p className="text-[11px] text-[#888888] px-3 py-2 bg-[#FAFAF9]">{content.gifCaption}</p>
                  )}
                </div>
              )}
              {figures.map((fig, i) => (
                <div key={i} className="rounded-xl border border-[#E2E8F0] bg-slate-50/80 p-3">
                  {fig.title && <p className="text-xs font-bold text-[#111111] mb-1">{fig.title}</p>}
                  {fig.caption && <p className="text-[11px] text-[#666666] mb-2 leading-snug">{fig.caption}</p>}
                  {fig.svg && (
                    <div className="rounded-lg bg-white p-2 flex justify-center border border-slate-100">
                      <img
                        src={svgToDataUrl(fig.svg)}
                        alt={fig.title || 'Figure'}
                        className="w-full max-w-sm h-auto max-h-52 object-contain animate-[pulse-soft_3s_ease-in-out_infinite]"
                      />
                    </div>
                  )}
                </div>
              ))}
              {!hasVisual && <p className="text-sm text-[#888888]">No extra figure for this concept.</p>}
            </div>
          )}

          {tab === 'formula' && (
            <div className="space-y-3">
              {content.formula && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 text-center">
                  <p className="text-[10px] font-bold text-teal-800 uppercase mb-2">Main formula</p>
                  <p className="text-lg sm:text-xl font-mono font-bold text-teal-900 break-words">{content.formula}</p>
                </div>
              )}
              {content.formulaBreakdown && (
                <p className="text-xs text-[#555555] whitespace-pre-line leading-relaxed">{content.formulaBreakdown}</p>
              )}
              {content.workedExample && (
                <div className="rounded-xl bg-[#F8F6F3] border border-[#E8E5E0] p-3">
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase mb-1">Worked example</p>
                  <p className="text-xs text-[#555555] whitespace-pre-line leading-relaxed">{content.workedExample}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'tries' && digest?.hasTries && (
            <div>
              <p className="text-sm text-[#555555] mb-3">
                Here is everything you typed on <strong>wrong tries</strong> this session (same order as you tried). The
                review tabs above are general—not tailored to one answer.
              </p>
              <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {digest.tries.map((t) => (
                  <li
                    key={t.n}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 text-xs border border-[#E8E5E0] rounded-xl px-3 py-2 bg-[#FAFAF9]"
                  >
                    <span className="text-[#AAAAAA] font-mono shrink-0">Try {t.n}</span>
                    <span className="font-mono text-[#111111]">{t.answer}</span>
                    <span className="text-[#888888] sm:ml-auto">{t.kind}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.92; }
        }
      `}</style>

      {/* Optional practice — never reveal numeric answer */}
      {simpleQ && !submitted && (
        <div className="card border-amber-100 bg-amber-50/40">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Quick try</p>
          </div>
          <p className="text-sm text-[#333333] mb-3">{simpleQ.question}</p>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              inputMode="decimal"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your answer…"
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="btn-primary text-xs px-4 shrink-0"
            >
              Check
            </motion.button>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="mt-3 w-full text-xs text-[#AAAAAA] hover:text-[#FF6500] transition-colors text-center"
          >
            Continue without checking →
          </button>
        </div>
      )}

      {simpleQ && submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border ${correct ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {correct ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-600" />
            )}
            <p className={`text-sm font-bold ${correct ? 'text-green-700' : 'text-amber-800'}`}>
              {correct ? 'Nice — you’re ready to continue!' : 'Keep going — use the formula tab and quiz next.'}
            </p>
          </div>
          {!correct && (
            <p className="text-xs text-[#666666] leading-relaxed">
              We don’t show the exact answer here on purpose. Apply the steps from <strong>Basics</strong> and{' '}
              <strong>Formula</strong> in the next quiz questions.
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="btn-primary w-full justify-center mt-3 text-xs py-2.5"
          >
            Continue quiz <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}

      {!simpleQ && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="btn-primary w-full justify-center text-sm py-3 rounded-xl"
        >
          Continue quiz <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
