import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Lightbulb,
  FlaskConical,
  Target,
  Sparkles,
} from 'lucide-react';

/**
 * Inline SVG via innerHTML can ignore hex fills in some environments. Encoding as a data-URL
 * forces the SVG/XML parser to apply presentation attributes reliably.
 */
function lessonFigureDataUrl(svgMarkup) {
  if (svgMarkup == null || typeof svgMarkup !== 'string') return '';
  let s = svgMarkup.replace(/%23/gi, '#').trim();
  if (!/\sxmlns\s*=/.test(s)) {
    s = s.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

/** Bold segments marked with **like this** (trusted lesson strings from API). */
function Rich({ children, className = '' }) {
  if (children == null || children === '') return null;
  const parts = String(children).split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        if (m) {
          return (
            <strong key={i} className="font-bold text-[#111111]">
              {m[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function SlideProgress({ total, current }) {
  return (
    <div className="flex gap-1 w-full mb-4">
      {Array.from({ length: total }).map((_, i) => {
        let cls = 'bg-[#E8E5E0]';
        if (i < current) cls = 'bg-emerald-500';
        else if (i === current) cls = 'bg-[#FF6500]';
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${cls}`}
          />
        );
      })}
    </div>
  );
}

function IntroSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight leading-tight">
        {slide.introHeadline}
      </h2>
      <div className="card border-orange-200 bg-orange-50/80">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E8E5E0] flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF6500]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FF6500] mb-2">{slide.introHook}</p>
            <p className="text-sm text-[#555555] leading-relaxed">
              <Rich>{slide.introBody}</Rich>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {(slide.introPills || []).map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444444] bg-white border border-[#E8E5E0] px-3 py-1.5 rounded-full shadow-sm"
            >
              <span className="text-emerald-600">✓</span> {p}
            </span>
          ))}
        </div>
      </div>
      <div className="card border-amber-200 bg-amber-50/90 flex gap-3 items-start">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-[#555555] leading-relaxed">
          <Rich>{slide.cheer}</Rich>
        </p>
      </div>
    </div>
  );
}

function LogicSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <div className="inline-flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5">
        <Brain className="w-3.5 h-3.5 text-teal-600" />
        <span className="text-[10px] font-bold tracking-widest text-teal-800">{slide.logicBadge}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-[#111111]">{slide.logicTitle}</h2>
      <p className="text-sm text-[#888888]">{slide.logicSubtitle}</p>
      <div
        className={`card ${slide.figureSvg ? 'grid sm:grid-cols-2 gap-4 items-center' : ''}`}
      >
        {slide.figureSvg && (
          <div className="min-w-0">
            {slide.figureTitle && (
              <p className="text-sm font-bold text-[#111111] mb-1 text-center sm:text-left">{slide.figureTitle}</p>
            )}
            {slide.figureCaption && (
              <p className="text-xs text-[#555555] mb-2 text-center sm:text-left leading-snug">{slide.figureCaption}</p>
            )}
            <div className="rounded-xl bg-[#F8FAFC] p-2 sm:p-3 flex justify-center items-center border border-[#E2E8F0]">
              <img
                src={lessonFigureDataUrl(slide.figureSvg)}
                alt={slide.figureTitle || 'Concept diagram'}
                className="w-full max-w-[min(100%,420px)] h-auto max-h-56 object-contain mx-auto"
                decoding="async"
              />
            </div>
          </div>
        )}
        <div className={slide.figureSvg ? '' : ''}>
          <h3 className="text-sm font-bold text-[#111111] mb-2">{slide.reasoningTitle}</h3>
          <p className="text-sm text-[#555555] leading-relaxed">
            <Rich>{slide.reasoningBody}</Rich>
          </p>
        </div>
      </div>
      <div className="card border-emerald-200 bg-emerald-50/60 flex gap-3">
        <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-[#166534] leading-relaxed">
          <span className="font-bold text-emerald-800">Key insight: </span>
          <Rich>{slide.keyInsight}</Rich>
        </p>
      </div>
    </div>
  );
}

function FormulaSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <span className="text-[10px] font-bold tracking-widest text-teal-700">FORMULA</span>
      <h2 className="text-2xl font-black text-[#111111]">The formula</h2>
      <div className="card border-teal-200 bg-teal-50/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-white border border-[#E8E5E0] flex items-center justify-center text-sm shadow-sm">
            😊
          </div>
          <p className="text-sm text-[#555555] leading-relaxed flex-1 min-w-0">
            <Rich>{slide.formulaIntro}</Rich>
          </p>
        </div>
        <p className="text-xs text-[#888888] mb-4">{slide.formulaTagline}</p>
        <p className="text-[10px] font-bold tracking-wider text-teal-800 mb-2">CORE FORMULA</p>
        <div className="rounded-xl bg-white border-2 border-[#FF6500]/30 px-4 py-5 text-center shadow-sm">
          <div className="text-xl sm:text-2xl font-mono font-bold text-[#111111] tracking-wide">
            {slide.coreFormula}
          </div>
        </div>
        {slide.formulaNote && (
          <p className="text-xs text-[#888888] mt-2 font-mono break-words">{slide.formulaNote}</p>
        )}
        {slide.whyFormulaNote && (
          <p className="text-xs text-[#666666] mt-3 border-t border-teal-200/80 pt-3">
            <Rich>{slide.whyFormulaNote}</Rich>
          </p>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-wider text-teal-800 mb-2">VARIABLES</p>
        <div className="space-y-2">
          {(slide.variables || []).map((v) => (
            <div key={v.sym} className="card py-2.5 flex items-start gap-3 bg-white">
              <span className="font-mono text-sm font-bold text-[#FF6500] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
                {v.sym}
              </span>
              <span className="text-sm text-[#555555]">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>
      {slide.caution && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex gap-2 text-sm text-amber-900">
          <span className="text-amber-600 shrink-0">⚠️</span>
          <Rich>{slide.caution}</Rich>
        </div>
      )}
    </div>
  );
}

function WorkedSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-3 py-1">
        <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
        <span className="text-[10px] font-bold tracking-widest text-purple-900">{slide.workedLabel}</span>
      </div>
      <h2 className="text-2xl font-black text-[#111111]">{slide.workedTitle}</h2>
      <p className="text-sm text-[#888888]">{slide.workedSubtitle}</p>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{slide.scenarioEmoji}</span>
            <span className="font-semibold text-[#111111] text-sm">{slide.scenarioTitle}</span>
          </div>
          <span className="text-[10px] text-[#AAAAAA] uppercase">Worked example</span>
        </div>
        <ol className="space-y-3">
          {(slide.steps || []).map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-lg bg-[#FF6500] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-[#444444] pt-1 font-mono leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 text-emerald-800 font-semibold text-sm">
          <span className="text-emerald-600">✓</span>
          <Rich>{slide.answerLine}</Rich>
        </div>
      </div>
    </div>
  );
}

function ReverseSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
          <span aria-hidden="true">🔍</span> {slide.reverseTitle}
        </h3>
        <span className="text-[10px] text-[#AAAAAA] uppercase">{slide.reverseTag}</span>
      </div>
      <div className="card space-y-3">
        {(slide.steps || []).map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center shrink-0 border border-sky-200">
              {i + 1}
            </span>
            <span className="text-sm text-[#444444] pt-1 font-mono leading-relaxed">{step}</span>
          </div>
        ))}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2 text-emerald-800 font-semibold text-sm">
          <span className="text-emerald-600">✓</span>
          <Rich>{slide.answerLine}</Rich>
        </div>
      </div>
    </div>
  );
}

function GuidedSlide({ slide }) {
  return (
    <div className="space-y-4 text-left">
      <h2 className="text-2xl font-black text-[#111111]">{slide.guidedTitle}</h2>
      <p className="text-sm text-[#FF6500] font-medium">{slide.guidedSubtitle}</p>
      <div className="card space-y-4">
        <p className="text-sm font-semibold text-[#111111]">{slide.problem}</p>
        {(slide.steps || []).map((s, i) => (
          <div key={i} className="rounded-xl border border-[#E8E5E0] bg-[#FAFAF9] p-3">
            <p className="text-[10px] text-[#888888] font-bold uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-sm font-mono text-[#333333] border border-orange-100 rounded-lg px-3 py-2 bg-white">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConceptMaterial({ material, onContinue }) {
  const slides = material?.lessonSlides?.length ? material.lessonSlides : [];
  const [idx, setIdx] = useState(0);

  if (!material) return null;

  if (!slides.length) {
    return (
      <div className="max-w-xl mx-auto card space-y-4">
        <p className="text-sm text-[#555555] leading-relaxed">{material.explanation}</p>
        <button type="button" onClick={onContinue} className="w-full btn-primary justify-center py-2.5">
          Start questions <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const total = slides.length;
  const slide = slides[idx];
  const isLast = idx === total - 1;

  const renderSlide = () => {
    switch (slide.type) {
      case 'intro':
        return <IntroSlide slide={slide} />;
      case 'logic':
        return <LogicSlide slide={slide} />;
      case 'formula':
        return <FormulaSlide slide={slide} />;
      case 'worked':
        return <WorkedSlide slide={slide} />;
      case 'reverse':
        return <ReverseSlide slide={slide} />;
      case 'guided':
        return <GuidedSlide slide={slide} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-[14px] overflow-hidden border border-[#E8E5E0] bg-white shadow-md -mx-1 sm:mx-0">
      <div className="px-4 pt-5 pb-3 sm:px-6 sm:pt-6">
        <SlideProgress total={total} current={idx} />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {renderSlide()}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-2 px-4 py-4 sm:px-6 border-t border-[#E8E5E0] bg-[#F8F6F3]">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="btn-secondary text-xs sm:text-sm py-2 px-3 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-[11px] text-[#888888] shrink-0">
          Page {idx + 1} of {total}
        </span>
        {isLast ? (
          <button type="button" onClick={onContinue} className="btn-primary text-xs sm:text-sm py-2 px-4">
            Start questions <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            className="btn-primary text-xs sm:text-sm py-2 px-4"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
