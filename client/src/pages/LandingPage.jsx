import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, TrendingUp, BookOpen, ArrowRight, Shield, Ruler, Layers, Box, Package } from 'lucide-react';

const features = [
  { icon: Brain,      title: 'Adaptive Learning',    desc: 'Questions auto-adjust to your level — harder when doing well, simpler when you need support.', bg: 'bg-green-50',  border: 'border-green-200',  ic: 'text-green-600' },
  { icon: Target,     title: 'Error Detection',       desc: 'Identifies exactly what went wrong — formula swap, unit error, radius/diameter confusion.',    bg: 'bg-blue-50',   border: 'border-blue-200',   ic: 'text-blue-600' },
  { icon: Zap,        title: '3-Level Hints',         desc: 'Progressive hints: concept → formula → step-by-step. Never get stuck again.',                  bg: 'bg-amber-50',  border: 'border-amber-200',  ic: 'text-amber-600' },
  { icon: BookOpen,   title: 'Remedial Engine',       desc: 'Struggling? The system re-teaches the concept from scratch with worked examples.',              bg: 'bg-orange-50', border: 'border-orange-200', ic: 'text-[#FF6500]' },
  { icon: TrendingUp, title: 'Mastery Tracking',      desc: 'Scientific mastery score using accuracy, hint usage, time efficiency, and confidence.',         bg: 'bg-purple-50', border: 'border-purple-200', ic: 'text-purple-600' },
  { icon: Shield,     title: 'Full Grade 8 Coverage', desc: 'Perimeter, Area, Surface Area, Volume — all shapes from the Grade 8 syllabus.',                 bg: 'bg-teal-50',   border: 'border-teal-200',   ic: 'text-teal-600' },
];

const topics = [
  { label: 'Perimeter',     shapes: 'Square · Rectangle · Circle', icon: Ruler,   tag: 'Explorer friendly', bg: 'bg-orange-50',  border: 'border-orange-200', ic: 'text-[#FF6500]', dot: '#FF6500' },
  { label: 'Area',          shapes: 'Square · Rectangle · Circle', icon: Layers,  tag: 'Core concept',      bg: 'bg-teal-50',    border: 'border-teal-200',   ic: 'text-teal-600',   dot: '#0D9488' },
  { label: 'Surface Area',  shapes: 'Cube · Cuboid · Cylinder',    icon: Box,     tag: '3D shapes',         bg: 'bg-blue-50',    border: 'border-blue-200',   ic: 'text-blue-600',   dot: '#3B82F6' },
  { label: 'Volume',        shapes: 'Cube · Cuboid · Cylinder',    icon: Package, tag: 'Legend level',          bg: 'bg-purple-50',  border: 'border-purple-200', ic: 'text-purple-600', dot: '#8B5CF6' },
];

// Floating study-material decoration elements
const DECORATIONS = [
  { symbol: 'π',  top: '8%',  left: '4%',  size: 48, rotate: -12, opacity: 0.07 },
  { symbol: '∑',  top: '18%', left: '90%', size: 52, rotate: 8,   opacity: 0.06 },
  { symbol: '√',  top: '55%', left: '6%',  size: 44, rotate: -6,  opacity: 0.07 },
  { symbol: '∫',  top: '70%', left: '88%', size: 56, rotate: 10,  opacity: 0.06 },
  { symbol: '²',  top: '35%', left: '94%', size: 36, rotate: 0,   opacity: 0.07 },
  { symbol: '÷',  top: '82%', left: '12%', size: 40, rotate: 15,  opacity: 0.06 },
  { symbol: '×',  top: '45%', left: '2%',  size: 34, rotate: -20, opacity: 0.05 },
  { symbol: '=',  top: '25%', left: '96%', size: 34, rotate: 5,   opacity: 0.06 },
  { symbol: 'A',  top: '90%', left: '80%', size: 38, rotate: -8,  opacity: 0.05 },
  { symbol: '△',  top: '12%', left: '50%', size: 32, rotate: 0,   opacity: 0.05 },
  { symbol: '○',  top: '60%', left: '48%', size: 28, rotate: 0,   opacity: 0.04 },
  { symbol: '□',  top: '78%', left: '62%', size: 26, rotate: 10,  opacity: 0.04 },
  { symbol: '⬡',  top: '30%', left: '15%', size: 36, rotate: -5,  opacity: 0.05 },
  { symbol: '%',  top: '50%', left: '82%', size: 32, rotate: 12,  opacity: 0.05 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-16 overflow-hidden bg-[#F8F6F3] relative">

      {/* Study-material background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {DECORATIONS.map((d, i) => (
          <div key={i} className="absolute select-none font-black text-[#FF6500]"
            style={{
              top: d.top, left: d.left,
              fontSize: d.size,
              opacity: d.opacity,
              transform: `rotate(${d.rotate}deg)`,
              lineHeight: 1,
              fontFamily: 'DM Sans, serif',
            }}>
            {d.symbol}
          </div>
        ))}
        {/* Subtle grid dot pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #FF650012 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 px-4 py-16 text-center max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          className="relative space-y-5">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-[#E8E5E0] bg-white text-[#888888] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Grade 8 Mensuration · MathMentor
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight text-[#111111]">
            Learn Smarter.<br />
            <span className="text-[#FF6500]">Master Faster.</span>
          </h1>

          <p className="text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
            MathMentor adapts to your pace, detects your exact mistakes, and teaches like a real tutor — not a static quiz app.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Link to="/register">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-primary px-6 py-2.5 text-sm">
                Start Free <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-secondary px-6 py-2.5 text-sm">
                Log in
              </motion.button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-2">
            {[['72', 'Questions'], ['12', 'Concepts'], ['3', 'Hint levels']].map(([num, lab]) => (
              <div key={lab} className="text-center">
                <div className="text-xl font-black text-[#FF6500]">{num}</div>
                <div className="text-xs text-[#888888]">{lab}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Topics */}
      <section className="relative z-10 px-4 py-10 max-w-4xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#AAAAAA] text-center mb-5">
          All Topics Covered
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div key={t.label}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className={`card card-hover text-center space-y-2 cursor-default py-4 ${t.bg} ${t.border}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto bg-white shadow-sm">
                  <Icon className={`w-4 h-4 ${t.ic}`} />
                </div>
                <div>
                  <div className="font-semibold text-[#111111] text-xs">{t.label}</div>
                  <div className="text-xs text-[#888888] mt-0.5">{t.shapes}</div>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full inline-block bg-white border border-[#E8E5E0] text-[#888888]">
                  {t.tag}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#111111]">Built Like a Real Tutor</h2>
          <p className="text-[#888888] mt-1.5 text-xs">Every feature designed for deeper learning, not just answering questions.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                className={`card card-hover space-y-2 ${f.bg} ${f.border}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm">
                  <Icon className={`w-4 h-4 ${f.ic}`} />
                </div>
                <h3 className="font-semibold text-[#111111] text-xs">{f.title}</h3>
                <p className="text-[#666666] text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-14 text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-sm mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-[#FFD700] shadow-md">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <h2 className="text-xl font-bold text-[#111111]">Ready to master Mensuration?</h2>
          <p className="text-[#888888] text-xs">Start practising now. Free, adaptive, built for you.</p>
          <Link to="/register">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-primary px-6 py-2.5 mx-auto">
              Start for Free <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="relative z-10 text-center py-6 text-[#AAAAAA] text-xs border-t border-[#E8E5E0]">
        MathMentor — Intelligent Tutoring System for Grade 8 Mensuration
      </footer>
    </div>
  );
}
