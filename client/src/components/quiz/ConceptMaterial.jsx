import { motion } from 'framer-motion';
import { formatTopicName, formatShapeName } from '../../utils/masteryCalc';
import {
  Brain,
  Lightbulb,
  FlaskConical,
  Target,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

function lessonFigureDataUrl(svgMarkup) {
  if (svgMarkup == null || typeof svgMarkup !== 'string') return '';
  let s = svgMarkup.replace(/%23/gi, '#').trim();
  if (!/\sxmlns\s*=/.test(s)) {
    s = s.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
}

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

function SectionShell({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border border-[#E8E5E0] bg-white shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
}

function IntroSlide({ slide }) {
  return (
    <div className="space-y-4 text-left p-5 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight leading-tight">
        {slide.introHeadline}
      </h2>
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/80 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5E0] flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#FF6500]" />
          </div>
          <div className="min-w-0">
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#444444] bg-white/90 border border-[#E8E5E0] px-3 py-1.5 rounded-full"
            >
              <span className="text-emerald-600">✓</span> {p}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50/90 flex gap-3 items-start p-4">
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
    <div className="space-y-4 text-left p-5 sm:p-6">
      <div className="inline-flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-1.5">
        <Brain className="w-3.5 h-3.5 text-teal-600" />
        <span className="text-[10px] font-bold tracking-widest text-teal-800">{slide.logicBadge}</span>
      </div>
      <h2 className="text-xl sm:text-2xl font-black text-[#111111]">{slide.logicTitle}</h2>
      <p className="text-sm text-[#888888]">{slide.logicSubtitle}</p>
      <div className={`rounded-2xl border border-[#E8E5E0] bg-[#FAFAF9] p-4 sm:p-5 ${slide.figureSvg ? 'grid lg:grid-cols-2 gap-6 items-start' : ''}`}>
        {slide.figureSvg && (
          <div className="min-w-0 order-2 lg:order-1">
            {slide.figureTitle && (
              <p className="text-sm font-bold text-[#111111] mb-1 text-center lg:text-left">{slide.figureTitle}</p>
            )}
            {slide.figureCaption && (
              <p className="text-xs text-[#555555] mb-2 text-center lg:text-left leading-snug">{slide.figureCaption}</p>
            )}
            <div className="rounded-xl bg-white p-3 flex justify-center border border-[#E2E8F0]">
              <img
                src={lessonFigureDataUrl(slide.figureSvg)}
                alt={slide.figureTitle || 'Concept diagram'}
                className="w-full max-w-md h-auto max-h-52 sm:max-h-64 object-contain"
                decoding="async"
              />
            </div>
          </div>
        )}
        <div className="order-1 lg:order-2 min-w-0">
          <h3 className="text-sm font-bold text-[#111111] mb-2">{slide.reasoningTitle}</h3>
          <p className="text-sm text-[#555555] leading-relaxed">
            <Rich>{slide.reasoningBody}</Rich>
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 flex gap-3 p-4">
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
    <div className="space-y-4 text-left p-5 sm:p-6">
      <span className="text-[10px] font-bold tracking-widest text-teal-700">FORMULA</span>
      <h2 className="text-xl sm:text-2xl font-black text-[#111111]">The formula</h2>
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/90 to-white p-4 sm:p-5">
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
        <div className="rounded-xl bg-white border-2 border-[#FF6500]/25 px-4 py-5 text-center shadow-inner">
          <div className="text-lg sm:text-2xl font-mono font-bold text-[#111111] tracking-wide break-words">
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
        <div className="grid sm:grid-cols-2 gap-2">
          {(slide.variables || []).map((v) => (
            <div key={v.sym} className="rounded-xl border border-[#E8E5E0] py-2.5 px-3 flex items-start gap-3 bg-white">
              <span className="font-mono text-sm font-bold text-[#FF6500] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 shrink-0">
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

/** No worked solution or final answer — practice happens in the quiz. */
function WorkedSlideTeaser({ slide }) {
  return (
    <div className="space-y-4 text-left p-5 sm:p-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-3 py-1">
        <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
        <span className="text-[10px] font-bold tracking-widest text-purple-900">{slide.workedLabel || 'Practice'}</span>
      </div>
      <h2 className="text-lg sm:text-xl font-black text-[#111111]">{slide.workedTitle}</h2>
      <p className="text-sm text-[#888888]">{slide.workedSubtitle}</p>
      <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{slide.scenarioEmoji}</span>
          <span className="font-semibold text-[#111111] text-sm">{slide.scenarioTitle}</span>
        </div>
        <p className="text-sm text-[#555555] leading-relaxed">
          You&apos;ll solve problems like this in the quiz using the formula above—step-by-step answers are hidden here so
          you can think first.
        </p>
      </div>
    </div>
  );
}

function ReverseSlideTeaser({ slide }) {
  return (
    <div className="space-y-4 text-left p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
        <span aria-hidden="true">🔍</span> {slide.reverseTitle}
      </h3>
      <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-4">
        <p className="text-sm text-[#555555] leading-relaxed">
          Reverse problems (finding a missing length from area or perimeter) appear in the quiz. Use the relationships you
          learned—no spoiler answers on this page.
        </p>
      </div>
    </div>
  );
}

function GuidedSlideTeaser({ slide }) {
  return (
    <div className="space-y-4 text-left p-5 sm:p-6">
      <h2 className="text-xl font-black text-[#111111]">{slide.guidedTitle}</h2>
      <p className="text-sm text-[#FF6500] font-medium">{slide.guidedSubtitle}</p>
      <div className="rounded-2xl border border-[#E8E5E0] bg-[#FAFAF9] p-4 sm:p-5">
        <p className="text-[10px] text-[#888888] font-bold uppercase tracking-wide mb-2">Try in the quiz</p>
        <p className="text-sm font-semibold text-[#111111] leading-relaxed">{slide.problem}</p>
      </div>
    </div>
  );
}

function renderSlide(slide, index) {
  const header =
    slide.type !== 'intro' ? (
      <div className="px-5 pt-4 sm:px-6 border-b border-[#F0EDE8] bg-[#FAFAF9]">
        <span className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider">
          Part {index + 1} · {slide.type.replace('_', ' ')}
        </span>
      </div>
    ) : null;

  let body = null;
  switch (slide.type) {
    case 'intro':
      body = <IntroSlide slide={slide} />;
      break;
    case 'logic':
      body = <LogicSlide slide={slide} />;
      break;
    case 'formula':
      body = <FormulaSlide slide={slide} />;
      break;
    case 'worked':
      body = <WorkedSlideTeaser slide={slide} />;
      break;
    case 'reverse':
      body = <ReverseSlideTeaser slide={slide} />;
      break;
    case 'guided':
      body = <GuidedSlideTeaser slide={slide} />;
      break;
    default:
      body = null;
  }
  if (!body) return null;

  return (
    <SectionShell key={`${slide.type}-${index}`}>
      {header}
      {body}
    </SectionShell>
  );
}

/**
 * Single-scroll concept page: one primary action to start the quiz.
 * Worked / guided / reverse slides show prompts only—no answers.
 */
export default function ConceptMaterial({ material, topic, shape, onContinue }) {
  const slides = material?.lessonSlides?.length ? material.lessonSlides : [];
  const title =
    material?.title ||
    (topic && shape ? `${formatShapeName(shape)} · ${formatTopicName(topic)}` : 'Concept');

  if (!material) return null;

  if (!slides.length) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-28">
        <div className="rounded-2xl border border-[#E8E5E0] bg-white shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[#FF6500] mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Concept</span>
          </div>
          <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-line">{material.explanation}</p>
          {material.formula && (
            <p className="mt-4 text-sm font-mono font-semibold text-teal-800 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
              {material.formula}
            </p>
          )}
        </div>
        <StickyStart onContinue={onContinue} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 px-0 sm:px-1 pb-28 sm:pb-32">
      <header className="text-center space-y-2 px-2 sm:px-0">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#FF6500] uppercase">Learn · one screen</p>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] leading-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-[#888888] max-w-lg mx-auto leading-relaxed">
          Scroll through the ideas below, then tap once to begin questions. No extra taps between sections.
        </p>
      </header>

      {slides.map((slide, i) => renderSlide(slide, i))}

      <StickyStart onContinue={onContinue} />
    </div>
  );
}

function StickyStart({ onContinue }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="rounded-2xl border border-[#E8E5E0] bg-white/95 backdrop-blur-md shadow-lg px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full btn-primary justify-center py-3 sm:py-3.5 text-sm font-black gap-2 rounded-xl"
          >
            Start answering questions
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-center text-[#AAAAAA] mt-2">Saves time—go straight to the adaptive quiz</p>
        </div>
      </div>
    </div>
  );
}
