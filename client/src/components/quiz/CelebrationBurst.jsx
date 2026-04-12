import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const COLORS = ['#FF6500', '#22C55E', '#FBBF24', '#3B82F6', '#A78BFA', '#14B8A6'];

const BURST_MS = 2600;

/**
 * Full-viewport overlay (pointer-events none). `burstId` increments on each correct answer;
 * the overlay shows for a few seconds then hides (burstId is not reset).
 */
export default function CelebrationBurst({ burstId }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!burstId) return undefined;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), BURST_MS);
    return () => clearTimeout(t);
  }, [burstId]);

  const particles = useMemo(() => {
    const n = 28;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 72 + Math.random() * 140;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        delay: Math.random() * 0.12,
        color: COLORS[i % COLORS.length],
        size: 5 + Math.random() * 9,
        rot: Math.random() * 360,
      };
    });
  }, [burstId]);

  return (
    <AnimatePresence>
      {visible && burstId > 0 && (
        <motion.div
          key={burstId}
          className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute flex items-center justify-center"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <motion.div
              animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="rounded-full bg-emerald-100 border-2 border-emerald-400 p-4 shadow-lg shadow-emerald-200/80"
            >
              <Sparkles className="w-14 h-14 text-emerald-600" strokeWidth={2} />
            </motion.div>
          </motion.div>

          {particles.map((p) => (
            <motion.span
              key={`${burstId}-${p.id}`}
              className="absolute rounded-full will-change-transform"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                left: '50%',
                top: '50%',
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0.6],
                x: p.x,
                y: p.y,
                rotate: p.rot,
              }}
              transition={{
                duration: 0.95,
                delay: p.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}

          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-emerald-400/10 via-transparent to-[#FF6500]/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
