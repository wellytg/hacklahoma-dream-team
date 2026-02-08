
import React from 'react';
import { motion } from 'framer-motion';
import { useIntake } from '~/context/IntakeContext';

export const ProgressBar: React.FC = () => {
  const { currentStep, totalSteps } = useIntake();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden mb-12">
      <motion.div
        className="h-full bg-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};
