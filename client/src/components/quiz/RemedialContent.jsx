import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ChevronRight,
  CheckCircle,
  XCircle,
  Sigma,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon,
  ListOrdered,
  Zap,
  ArrowRight,
  Wrench,
  BookOpen,
} from 'lucide-react';

function svgToDataUrl(svgMarkup) {
  if (svgMarkup == null || typeof svgMarkup !== 'string') return '';
  let s = svgMarkup.replace(/%23/gi, '#').trim();
  if (!/\sxmlns\s*=/.test(s)) {
    s = s.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

// Category → colour token
const CATEGORY_COLOUR = {
  'Missing sides':       { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    icon: 'text-red-500' },
  'Missing faces':       { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    icon: 'text-red-500' },
  'Missing parts':       { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    icon: 'text-red-500' },
  'Missing dimension':   { bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700',    icon: 'text-red-500' },
  'Missing constant':    { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'text-orange-500' },
  'Formula mix-up':      { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-500' },
  'Incomplete formula':  { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700', icon: 'text-amber-500' },
  'Wrong operation':     { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'text-orange-500' },
  'Wrong power':         { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'text-orange-500' },
  'Wrong formula variant': { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-500' },
  'Wrong formula':       { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'text-purple-500' },
  'Wrong input value':   { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',  icon: 'text-blue-500' },
  'Reverse-find error':  { bg: 'bg-teal-50',   border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700',  icon: 'text-teal-500' },
  'Calculation slip':    { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: 'text-yellow-600' },
  'Unit mistake':        { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',  icon: 'text-blue-500' },
  'MCQ error':           { bg: 'bg-slate-50',  border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-700', icon: 'text-slate-500' },
  'True-False error':    { bg: 'bg-slate-50',  border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-700', icon: 'text-slate-500' },
  'Input error':         { bg: 'bg-slate-50',  border: 'border-slate-200',  badge: 'bg-slate-100 text-slate-700', icon: 'text-slate-500' },
  'Unidentified error':  { bg: 'bg-gray-50',   border: 'border-gray-200',   badge: 'bg-gray-100 text-gray-600',  icon: 'text-gray-400' },
};
const DEFAULT_COLOUR = {
  bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600', icon: 'text-gray-400',
};

function colourFor(category) {
  return CATEGORY_COLOUR[category] || DEFAULT_COLOUR;
}

// One error insight card
function InsightCard({ insight }) {
  const c = colourFor(insight.category);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${c.border} ${c.bg} p-4 space-y-3`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className={`w-4 h-4 shrink-0 ${c.icon}`} />
          <span className="text-sm font-bold text-[#111111] leading-tight">{insight.label}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${c.badge}`}>
          {insight.category}
        </span>
      </div>

      {/* Body rows */}
      <div className="space-y-2 text-xs">
        {/* What you did */}
        <div className="flex gap-2">
          <span className="shrink-0 w-16 font-semibold text-[#888888]">You did:</span>
          <span className="text-[#444444] leading-snug">{insight.whatYouDid}</span>
        </div>

        {/* Why wrong */}
        <div className="flex gap-2">
          <span className="shrink-0 w-16 font-semibold text-[#888888]">Why:</span>
          <span className="text-[#444444] leading-snug">{insight.whyWrong}</span>
        </div>

        {/* Fix */}
        <div className="flex gap-2 rounded-lg bg-white/70 border border-green-200 px-2.5 py-1.5">
          <Wrench className="w-3.5 h-3.5 shrink-0 text-green-600 mt-0.5" />
          <span className="text-green-800 font-medium leading-snug">{insight.fix}</span>
        </div>

        {/* Remember */}
        {insight.remember && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3 shrink-0 text-[#FF6500]" />
            <span className="font-mono text-[11px] text-[#FF6500] font-semibold">{insight.remember}</span>
          </div>
        )}
      </div>

      {/* Repeated tries badge */}
      {insight.count > 1 && (
        <p className="text-[10px] text-[#AAAAAA]">This pattern appeared {insight.count} time{insight.count > 1 ? 's' : ''}.</p>
      )}
    </motion.div>
  );
}

export default function RemedialContent({ content, onContinue }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [tab, setTab] = useState('mistakes');
  const [gifFailed, setGifFailed] = useState(false);

  if (!content) return null;

  const simpleQ = content.simpleQuestion || null;
  const digest = content.sessionDigest;
  const figures = content.figures || [];
  const errorInsights = Array.isArray(content.errorInsights) ? content.errorInsights : [];
  const hasVisual = (content.gifUrl && !gifFailed) || figures.length > 0;
  const hasMistakes = errorInsights.length > 0 || digest?.hasTries;

  const TABS = [
    { id: 'mistakes', label: 'Mistakes',  Icon: Zap,         show: hasMistakes },
    { id: 'basics',   label: 'How it works', Icon: Sparkles,  show: true },
    { id: 'formula',  label: 'Formula',   Icon: Sigma,       show: true },
    { id: 'visual',   label: 'Figures',   Icon: ImageIcon,   show: hasVisual },
  ];

  // Default to basics if no mistakes
  const activeTab = (tab === 'mistakes' && !hasMistakes) ? 'basics' : tab;

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
      {/* Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="w-5 h-5 text-[#FF6500]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#FF6500] uppercase tracking-widest">Remedial review</p>
            <h2 className="text-lg font-black text-[#111111] mt-1">{content.title}</h2>
            {content.tagline && (
              <p className="text-sm text-[#555555] mt-1 leading-relaxed">{content.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 rounded-2xl bg-[#F0EDE8] border border-[#E8E5E0]">
        {TABS.filter(t => t.show).map(({ id, label, Icon }) => {
          const active = activeTab === id;
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
              {id === 'mistakes' && errorInsights.length > 0 && (
                <span className={`ml-0.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                  active ? 'bg-[#FF6500] text-white' : 'bg-orange-200 text-orange-700'
                }`}>
                  {errorInsights.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm p-4 sm:p-5 min-h-[180px]"
        >

          {/* ── MISTAKES TAB ─────────────────────────────────────────────── */}
          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              {errorInsights.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-[#FF6500]" />
                    <p className="text-xs font-bold text-[#111111]">
                      {errorInsights.length === 1 ? 'Here is the mistake we detected:' : `Here are the ${errorInsights.length} mistake patterns we detected:`}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {errorInsights.map((ins, i) => (
                      <InsightCard key={i} insight={ins} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#888888]">No specific mistake patterns recorded.</p>
              )}

              {/* Compact tries list */}
              {digest?.hasTries && (
                <div>
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-2 mt-2">
                    All your tries
                  </p>
                  <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {digest.tries.map((t) => (
                      <li
                        key={t.n}
                        className="flex items-center gap-2 text-xs border border-[#E8E5E0] rounded-lg px-3 py-2 bg-[#FAFAF9]"
                      >
                        <span className="text-[#AAAAAA] font-mono shrink-0 w-9">Try {t.n}</span>
                        <ArrowRight className="w-3 h-3 text-[#DDDDDD] shrink-0" />
                        <span className="font-mono text-[#111111] shrink-0">{t.answer}</span>
                        <span className="text-[#888888] ml-auto text-[10px]">{t.kind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── BASICS TAB ──────────────────────────────────────────────── */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              {content.intro && (
                <p className="text-sm text-[#444444] leading-relaxed font-medium">{content.intro}</p>
              )}

              {/* Key points */}
              {Array.isArray(content.basicsBullets) && content.basicsBullets.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ListOrdered className="w-3 h-3" /> Key points
                  </p>
                  <ul className="space-y-2">
                    {content.basicsBullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[#555555] leading-relaxed">
                        <span className="w-5 h-5 rounded-lg bg-[#FF6500]/10 text-[#FF6500] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps to solve */}
              {Array.isArray(content.stepsToSolve) && content.stepsToSolve.length > 0 && (
                <div className="rounded-xl bg-teal-50 border border-teal-200 p-3.5">
                  <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                    <ListOrdered className="w-3 h-3" /> Steps to solve
                  </p>
                  <ol className="space-y-2">
                    {content.stepsToSolve.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-xs text-teal-900 leading-snug font-medium">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Common mistake warning */}
              {content.keyMistake && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-red-600 uppercase mb-1">Common mistake to avoid</p>
                    <p className="text-xs text-red-800 leading-snug">{content.keyMistake}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── FORMULA TAB ─────────────────────────────────────────────── */}
          {activeTab === 'formula' && (
            <div className="space-y-3">
              {content.formula && (
                <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 text-center">
                  <p className="text-[10px] font-bold text-teal-700 uppercase mb-2">Main formula</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-teal-900 break-words">{content.formula}</p>
                </div>
              )}
              {content.formulaBreakdown && (
                <div>
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase mb-1.5">What each symbol means</p>
                  <p className="text-xs text-[#555555] whitespace-pre-line leading-relaxed">{content.formulaBreakdown}</p>
                </div>
              )}
              {content.workedExample && (
                <div className="rounded-xl bg-[#F8F6F3] border border-[#E8E5E0] p-3.5">
                  <p className="text-[10px] font-bold text-[#AAAAAA] uppercase mb-2 flex items-center gap-1">
                    <ListOrdered className="w-3 h-3" /> Worked example
                  </p>
                  <p className="text-xs text-[#555555] whitespace-pre-line leading-relaxed">{content.workedExample}</p>
                </div>
              )}
            </div>
          )}

          {/* ── VISUAL TAB ──────────────────────────────────────────────── */}
          {activeTab === 'visual' && (
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
                        className="w-full max-w-sm h-auto max-h-52 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
              {!hasVisual && <p className="text-sm text-[#888888]">No extra figure for this concept.</p>}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Practice question */}
      {simpleQ && !submitted && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Quick practice</p>
          </div>
          <p className="text-sm text-[#333333] mb-3 leading-snug">{simpleQ.question}</p>
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
            Skip and continue →
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
            {correct
              ? <CheckCircle className="w-4 h-4 text-green-600" />
              : <XCircle className="w-4 h-4 text-amber-600" />
            }
            <p className={`text-sm font-bold ${correct ? 'text-green-700' : 'text-amber-800'}`}>
              {correct ? 'Nice — you have got it!' : 'Keep at it — use the Basics and Formula tabs.'}
            </p>
          </div>
          {!correct && (
            <p className="text-xs text-[#666666] leading-relaxed">
              The answer is not shown on purpose. Work through the steps in <strong>How it works</strong> and try the next quiz questions.
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
