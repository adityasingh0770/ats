import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, ArrowRight, Ruler, Layers, Box, Package } from 'lucide-react';
import { warmupBackend } from '../services/apiClient';

const highlights = [
  { icon: Brain, text: 'Difficulty adjusts as you learn' },
  { icon: Target, text: 'Pinpoints formula and unit mistakes' },
  { icon: Zap, text: 'Layered hints when you’re stuck' },
];

const topics = [
  { label: 'Perimeter', shapes: 'Square · Rectangle · Circle', icon: Ruler, ic: 'text-[#FF6500]' },
  { label: 'Area', shapes: 'Square · Rectangle · Circle', icon: Layers, ic: 'text-teal-600' },
  { label: 'Surface Area', shapes: 'Cube · Cuboid · Cylinder', icon: Box, ic: 'text-blue-600' },
  { label: 'Volume', shapes: 'Cube · Cuboid · Cylinder', icon: Package, ic: 'text-purple-600' },
];

export default function LandingPage() {
  useEffect(() => {
    warmupBackend();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-[#F8F6F3]">

      {/* Hero */}
      <section className="px-4 py-20 sm:py-24 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-[#111111]">
            Learn smarter.
            <br />
            <span className="text-[#FF6500]">Master mensuration.</span>
          </h1>

          <p className="text-sm text-[#666666] leading-relaxed">
            Build confidence in perimeter, area, surface area, and volume — one clear question at a time.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-8 py-3 text-sm"
              >
                Enter <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
            <Link to="/login" className="text-xs text-[#888888] hover:text-[#111111] transition-colors">
              Already have an account? Log in
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Topics */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <p className="text-center text-xs font-medium text-[#AAAAAA] mb-4">What you’ll practise</p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {topics.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card py-3 px-3 text-left"
              >
                <Icon className={`w-4 h-4 ${t.ic} mb-2`} />
                <div className="font-semibold text-[#111111] text-xs">{t.label}</div>
                <div className="text-[11px] text-[#888888] mt-0.5 leading-snug">{t.shapes}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Short highlights */}
      <section className="px-4 pb-20 max-w-lg mx-auto">
        <ul className="space-y-3">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.li
                key={h.text}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 text-sm text-[#444444]"
              >
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white border border-[#E8E5E0] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#FF6500]" />
                </span>
                {h.text}
              </motion.li>
            );
          })}
        </ul>
      </section>

      <footer className="text-center py-8 text-[#AAAAAA] text-xs border-t border-[#E8E5E0]">
        MathMentor — Grade 8 mensuration
      </footer>
    </div>
  );
}
