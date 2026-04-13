import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, ArrowRight, Ruler, Layers, Box, Package, Lock, GraduationCap } from 'lucide-react';
import { warmupBackend } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';

const highlights = [
  { icon: Brain, text: 'Difficulty adjusts as you learn' },
  { icon: Target, text: 'Pinpoints formula and unit mistakes' },
  { icon: Zap, text: 'Layered hints when you’re stuck' },
];

const topics = [
  { label: 'Perimeter', shapes: 'Square · Rectangle · Circle', icon: Ruler, ic: 'text-[#FF6500]', step: 1 },
  { label: 'Area', shapes: 'Square · Rectangle · Circle', icon: Layers, ic: 'text-teal-600', step: 2 },
  { label: 'Surface Area', shapes: 'Cube · Cuboid · Cylinder', icon: Box, ic: 'text-blue-600', step: 3 },
  { label: 'Volume', shapes: 'Cube · Cuboid · Cylinder', icon: Package, ic: 'text-purple-600', step: 4 },
];

export default function LandingPage() {
  const token = useAuthStore((s) => s.token);

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
            {token ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary px-8 py-3 text-sm"
                >
                  Continue to practice <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
            ) : (
              <motion.a
                href="https://kaushik-dev.online"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-8 py-3 text-sm inline-flex items-center justify-center gap-1.5"
              >
                Open Merge portal <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            )}
            <p className="text-[11px] text-[#888888] max-w-sm mx-auto leading-relaxed">
              <strong className="text-[#555555]">From the Merge portal:</strong> open this chapter using the portal’s
              link — it must include <span className="font-mono">token</span>, <span className="font-mono">student_id</span>, and{' '}
              <span className="font-mono">session_id</span> in the URL (do not bookmark plain <span className="font-mono">/chapter</span>).
            </p>
          </div>
        </motion.div>
      </section>

      {/* Topics — fixed curriculum order (same locks in the app) */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <div className="text-center mb-4 space-y-1">
          <p className="text-xs font-bold text-[#111111] flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#FF6500]" />
            Your learning path (locked order)
          </p>
          <p className="text-[11px] text-[#888888] max-w-md mx-auto leading-relaxed">
            Everyone studies <strong className="text-[#555555]">Perimeter → Area → Surface area → Volume</strong>. Later
            topics open after you build enough mastery on the previous one.
          </p>
        </div>
        <div className="relative pl-4 border-l-2 border-[#E8E5E0] ml-3 space-y-3">
          {topics.map((t, i) => {
            const Icon = t.icon;
            const locked = i > 0;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-5"
              >
                <span
                  className="absolute -left-[21px] top-3 w-6 h-6 rounded-full bg-white border-2 border-[#E8E5E0] flex items-center justify-center text-[10px] font-black text-[#FF6500]"
                  aria-hidden
                >
                  {t.step}
                </span>
                <div
                  className={`card py-3 px-3 text-left border ${locked ? 'border-dashed border-[#E0DDD8] bg-[#FAFAF9]' : 'border-[#E8E5E0]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Icon className={`w-4 h-4 ${t.ic} mb-2 shrink-0`} />
                    {locked && <Lock className="w-3.5 h-3.5 text-[#CCCCCC] shrink-0" aria-label="Unlocks later" />}
                  </div>
                  <div className="font-semibold text-[#111111] text-xs">{t.label}</div>
                  <div className="text-[11px] text-[#888888] mt-0.5 leading-snug">{t.shapes}</div>
                  {locked && (
                    <p className="text-[10px] text-[#AAAAAA] mt-2 leading-snug">Opens after you finish the previous topic.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-6 text-center space-y-2">
          {token ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6500] hover:text-[#E55500]"
            >
              Go to dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <p className="text-[11px] text-[#888888] max-w-sm mx-auto">
              Sign in happens when you open your chapter from the Merge portal (the URL must include{' '}
              <span className="font-mono">token</span>, <span className="font-mono">student_id</span>, and{' '}
              <span className="font-mono">session_id</span>).
            </p>
          )}
          <p className="text-[11px] text-[#888888] max-w-sm mx-auto">
            Progress is tied to this browser (local storage) so you can pick up where you left off.
          </p>
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
