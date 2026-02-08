
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { QuestionOption } from '../types';

interface QuestionStepProps {
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  selectedValues: string | string[];
  onSelect: (value: string) => void;
  allowMultiple?: boolean;
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  title,
  subtitle,
  options,
  selectedValues,
  onSelect,
  allowMultiple = false
}) => {
  const isSelected = (id: string) => {
    if (Array.isArray(selectedValues)) return selectedValues.includes(id);
    return selectedValues === id;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-light text-stone-800 mb-3">{title}</h2>
        {subtitle && <p className="text-stone-500 text-lg font-light leading-relaxed">{subtitle}</p>}
      </header>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`w-full p-5 text-left rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
              isSelected(option.id)
                ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className={`font-medium transition-colors ${isSelected(option.id) ? 'text-emerald-800' : 'text-stone-700'}`}>
                {option.label}
              </div>
              {option.sublabel && (
                <div className="text-sm text-stone-400 mt-1 font-light">{option.sublabel}</div>
              )}
            </div>
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
              isSelected(option.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-200 group-hover:border-stone-300'
            }`}>
              {isSelected(option.id) && <Check size={14} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
