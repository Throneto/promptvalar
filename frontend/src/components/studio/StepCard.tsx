import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
}

const StepCard = ({ stepNumber, title, description, children }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stepNumber * 0.1 }}
      className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl border border-purple-300 dark:border-purple-500/30 overflow-hidden shadow-2xl"
    >
      {/* Card header */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-600/20 dark:to-pink-600/20 px-8 py-6 border-b border-purple-300 dark:border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-500 text-white font-bold text-xl">
            {stepNumber}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-purple-800 dark:text-purple-200 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-8">{children}</div>
    </motion.div>
  );
};

export default StepCard;

