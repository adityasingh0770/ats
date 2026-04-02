import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatTopicName, formatShapeName } from '../../utils/masteryCalc';

const MCQ_COLORS = {
  A: { bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400', text: 'text-blue-700', label: 'bg-blue-100 text-blue-700' },
  B: { bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-400', text: 'text-purple-700', label: 'bg-purple-100 text-purple-700' },
  C: { bg: 'bg-teal-50 hover:bg-teal-100 border-teal-200 hover:border-teal-400', text: 'text-teal-700', label: 'bg-teal-100 text-teal-700' },
  D: { bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-400', text: 'text-orange-700', label: 'bg-orange-100 text-orange-700' },
};

export default function QuestionCard({ question, onSubmit, timeRef, disabled, inputKey }) {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [tfSelected, setTfSelected] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setAnswer('');
    setSelectedOption('');
    setTfSelected('');
    setTimeElapsed(0);
    if (timeRef) timeRef.current = Date.now();
    if (question?.type === 'direct_calculation' || question?.type === 'fill_in_blank' ||
        question?.type === 'reverse_find' || question?.type === 'word_problem' ||
        question?.type === 'cost_problem' || question?.type === 'comparison' ||
        question?.type === 'error_correction') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [question?.id, question?.qid, inputKey]);

  const getTimeSpent = () => timeRef ? Math.round((Date.now() - timeRef.current) / 1000) : timeElapsed;

  const handleNumericSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || disabled) return;
    clearInterval(timerRef.current);
    onSubmit(parseFloat(answer), getTimeSpent());
  };

  const handleMCQSelect = (option) => {
    if (disabled) return;
    setSelectedOption(option);
  };

  const handleMCQSubmit = () => {
    if (!selectedOption || disabled) return;
    clearInterval(timerRef.current);
    onSubmit(selectedOption, getTimeSpent());
  };

  const handleTFSubmit = (verdict) => {
    if (disabled) return;
    setTfSelected(verdict);
    clearInterval(timerRef.current);
    onSubmit(verdict, getTimeSpent());
  };

  const isOverTime = timeElapsed > (question?.expectedTime || 60) * 1.5;
  const isNumericType = !['mcq', 'true_false'].includes(question?.type || 'direct_calculation');

  if (!question) return null;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="card space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge label={formatTopicName(question.topic)} type={question.topic} size="xs" />
          <Badge label={formatShapeName(question.shape)} type="default" size="xs" />
          <Badge label={question.difficulty} type={question.difficulty} size="xs" />
          {question.type && question.type !== 'direct_calculation' && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium uppercase tracking-wide">
              {question.type.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs ${isOverTime ? 'text-red-500' : 'text-[#AAAAAA]'}`}>
          <Clock className="w-3.5 h-3.5" />{timeElapsed}s
        </div>
      </div>

      {/* Question text */}
      <div className="space-y-2">
        <p className="text-sm text-[#111111] leading-relaxed font-medium">{question.question}</p>
      </div>


      {/* === ANSWER AREA — dimmed when locked === */}
      <div className={`transition-opacity duration-200 ${disabled ? 'opacity-40 pointer-events-none select-none' : 'opacity-100'}`}>

      {/* === MCQ INPUT === */}
      {question.type === 'mcq' && question.options && (
        <div className="space-y-2">
          <p className="text-xs text-[#888888]">Select the correct option:</p>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(question.options).map(([letter, text]) => {
              const col = MCQ_COLORS[letter];
              const isSelected = selectedOption === letter;
              return (
                <motion.button
                  key={letter}
                  type="button"
                  onClick={() => handleMCQSelect(letter)}
                  disabled={disabled}
                  whileHover={{ scale: disabled ? 1 : 1.01 }}
                  whileTap={{ scale: disabled ? 1 : 0.99 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all
                    ${isSelected ? `${col.bg.split(' ')[2].replace('border-', 'border-')} border-2 ring-2 ring-offset-1` : `bg-white border-[#E8E5E0] hover:border-gray-300`}
                    ${isSelected ? col.bg : ''}
                    disabled:opacity-50 disabled:cursor-not-allowed`}>
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0
                    ${isSelected ? `${col.label}` : 'bg-gray-100 text-gray-500'}`}>
                    {letter}
                  </span>
                  <span className={`text-sm font-medium ${isSelected ? col.text : 'text-[#333333]'}`}>{text}</span>
                  {isSelected && <CheckCircle2 className={`w-4 h-4 ml-auto shrink-0 ${col.text}`} />}
                </motion.button>
              );
            })}
          </div>
          <motion.button
            onClick={handleMCQSubmit}
            disabled={!selectedOption || disabled}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full btn-primary py-2.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Submit Answer
          </motion.button>
        </div>
      )}

      {/* === TRUE / FALSE INPUT === */}
      {question.type === 'true_false' && (
        <div className="space-y-2">
          <p className="text-xs text-[#888888]">Is the statement True or False?</p>
          <div className="grid grid-cols-2 gap-3">
            {['True', 'False'].map((verdict) => {
              const isTrue = verdict === 'True';
              const isSelected = tfSelected === verdict;
              return (
                <motion.button
                  key={verdict}
                  type="button"
                  onClick={() => handleTFSubmit(verdict)}
                  disabled={disabled}
                  whileHover={{ scale: disabled ? 1 : 1.03 }}
                  whileTap={{ scale: disabled ? 1 : 0.97 }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold text-sm transition-all
                    ${isSelected
                      ? isTrue ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'
                      : 'bg-white border-[#E8E5E0] text-[#555] hover:border-gray-300'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {isTrue
                    ? <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                    : <XCircle className={`w-4 h-4 ${isSelected ? 'text-red-500' : 'text-gray-400'}`} />}
                  {verdict}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* === NUMERIC INPUT (all other types) === */}
      {isNumericType && (
        <form onSubmit={handleNumericSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs text-[#888888]">Your Answer ({question.unit})</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="number"
                step="any"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNumericSubmit(e)}
                placeholder={`Enter answer in ${question.unit}`}
                disabled={disabled}
                className="input-field flex-1"
              />
              <motion.button
                type="submit"
                disabled={!answer.trim() || disabled}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="btn-primary px-4 disabled:opacity-40 disabled:cursor-not-allowed">
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

        <div className="flex justify-end">
          <span className="text-xs text-[#CCCCCC]">~{question.expectedTime}s expected</span>
        </div>
        </form>
      )}

      {/* Expected time for MCQ/TF */}
      {!isNumericType && (
        <div className="flex justify-end pt-1">
          <span className="text-xs text-[#CCCCCC]">~{question.expectedTime}s expected</span>
        </div>
      )}

      </div>{/* end answer area */}
    </motion.div>
  );
}
