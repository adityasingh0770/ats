import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Lightbulb, Sigma } from 'lucide-react';

export default function ConceptMaterial({ material, onContinue }) {
  if (!material) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto space-y-4">
      <div className="card border-orange-200 bg-orange-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-[#FF6500]" />
          </div>
          <h2 className="text-sm font-black text-[#111111]">{material.title}</h2>
        </div>
        <p className="text-sm text-[#555555] leading-relaxed">{material.explanation}</p>
      </div>

      {material.formulas?.length > 0 && (
        <div className="card border-teal-200 bg-teal-50">
          <div className="flex items-center gap-2 mb-3">
            <Sigma className="w-3.5 h-3.5 text-teal-600" />
            <h3 className="text-xs font-bold text-teal-700">Key Formulas</h3>
          </div>
          <div className="space-y-2">
            {material.formulas.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-2 p-2.5 rounded-xl border border-teal-200 bg-white">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                <div>
                  {f.name && <div className="text-[10px] text-[#888888] mb-0.5">{f.name}</div>}
                  <div className="text-xs font-mono text-teal-700 font-semibold">{f.formula}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {material.tip && (
        <div className="flex gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-[#555555] leading-relaxed">{material.tip}</p>
        </div>
      )}

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full btn-primary justify-center py-2.5">
        Start Questions <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
