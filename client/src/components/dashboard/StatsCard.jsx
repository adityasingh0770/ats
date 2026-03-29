import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, Icon, color = '#FF6500', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="card card-hover py-2.5 px-2.5 min-w-0 w-full lg:flex-1"
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] text-[#888888] line-clamp-2 leading-tight">{title}</p>
          <p className="text-base font-black text-[#111111] tabular-nums leading-tight">{value}</p>
          {subtitle && <p className="text-[8px] text-[#BBBBBB] line-clamp-2 leading-snug">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${color}15` }}>
            <Icon className="w-3 h-3" style={{ color }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
