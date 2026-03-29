import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-2 border-orange-200 border-t-[#FF6500]`} />
      </div>
      {text && <p className="text-[#AAAAAA] text-xs animate-pulse">{text}</p>}
    </div>
  );
}

export function FullPageLoader({ text }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F3]">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
