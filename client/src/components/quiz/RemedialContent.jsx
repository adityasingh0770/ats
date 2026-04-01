import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, CheckCircle, XCircle, Sigma, AlertCircle } from 'lucide-react';

export default function RemedialContent({ content, onContinue }) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(null);

  if (!content) return null;

  const simpleQ = content.simpleQuestion || null;
  const checkAnswer = simpleQ?.answer ?? null;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const isCorrect = Math.abs(parseFloat(answer) - parseFloat(checkAnswer)) < 0.5;
    setCorrect(isCorrect);
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-xl mx-auto">

      {/* Banner */}
      <div className="flex items-center gap-2 p-3 rounded-2xl border border-orange-200 bg-orange-50">
        <Brain className="w-4 h-4 text-[#FF6500] shrink-0" />
        <div>
          <p className="text-xs font-black text-[#FF6500] uppercase tracking-wider">Remedial Mode</p>
          <p className="text-[10px] text-[#888888]">Let's rebuild the concept, then continue from where you left off</p>
        </div>
      </div>

      {/* Concept explanation */}
      <div className="card">
        <h3 className="text-sm font-bold text-[#111111] mb-1.5">{content.title}</h3>
        <p className="text-sm text-[#555555] leading-relaxed whitespace-pre-line">{content.explanation}</p>
      </div>

      {/* Formula */}
      {content.formula && (
        <div className="p-3 rounded-2xl border border-teal-200 bg-teal-50">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sigma className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Formula</span>
          </div>
          <p className="text-sm font-mono text-teal-700 font-semibold">{content.formula}</p>
          {content.formulaBreakdown && (
            <p className="text-xs text-teal-600 mt-1">{content.formulaBreakdown}</p>
          )}
        </div>
      )}

      {/* Worked example */}
      {content.workedExample && (
        <div className="card bg-[#F8F6F3]">
          <p className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-wider mb-1.5">Worked Example</p>
          <p className="text-sm text-[#555555] leading-relaxed">{content.workedExample}</p>
        </div>
      )}

      {/* Quick check — only if a simple question exists */}
      {simpleQ && !submitted && (
        <div className="card">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Quick Check</p>
          </div>
          <p className="text-sm text-[#333333] mb-3">{simpleQ.question}</p>
          <div className="flex gap-2">
            <input
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              type="number"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Your answer…"
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={handleSubmit}
              className="btn-primary text-xs px-4">
              Check
            </motion.button>
          </div>
          {/* Skip check and go back directly */}
          <button
            onClick={onContinue}
            className="mt-3 w-full text-xs text-[#AAAAAA] hover:text-[#FF6500] transition-colors text-center">
            Skip and continue quiz →
          </button>
        </div>
      )}

      {/* After check answer submitted */}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-2xl border ${correct
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-1">
            {correct
              ? <CheckCircle className="w-4 h-4 text-green-600" />
              : <XCircle className="w-4 h-4 text-red-500" />}
            <p className={`text-sm font-bold ${correct ? 'text-green-700' : 'text-red-600'}`}>
              {correct ? 'Great — concept understood!' : 'Not quite, but keep going!'}
            </p>
          </div>
          {!correct && checkAnswer != null && (
            <p className="text-xs text-[#888888] mb-2">
              Answer: <strong className="text-[#111111]">{checkAnswer}</strong>
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="btn-primary w-full justify-center mt-2 text-xs py-2.5">
            Continue Quiz <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}

      {/* Always-visible continue button when there's no check question */}
      {!simpleQ && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          className="btn-primary w-full justify-center text-sm py-2.5">
          Continue Quiz <ChevronRight className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
