import { motion } from 'framer-motion';

const variants = {
  Explorer:     'bg-green-100   text-green-700   border border-green-200',
  Scholar:      'bg-orange-100  text-orange-600  border border-orange-200',
  Legend:       'bg-purple-100  text-purple-700  border border-purple-200',
  beginner:     'bg-green-100   text-green-700   border border-green-200',
  intermediate: 'bg-orange-100  text-orange-600  border border-orange-200',
  advanced:     'bg-purple-100  text-purple-700  border border-purple-200',
  perimeter:    'bg-orange-100  text-orange-600  border border-orange-200',
  area:         'bg-teal-100    text-teal-700    border border-teal-200',
  surface_area: 'bg-blue-100    text-blue-700    border border-blue-200',
  volume:       'bg-purple-100  text-purple-700  border border-purple-200',
};

export default function Badge({ label, type, size = 'sm', pulse = false }) {
  const cls = variants[type] || variants[label] || 'bg-gray-100 text-gray-600 border border-gray-200';
  const sz  = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : size === 'lg' ? 'text-xs px-3 py-1' : 'text-xs px-2 py-0.5';

  return (
    <motion.span
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${cls} ${sz} ${pulse ? 'animate-pulse' : ''}`}
    >
      {label}
    </motion.span>
  );
}
