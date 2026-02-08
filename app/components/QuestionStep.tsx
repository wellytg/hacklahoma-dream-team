import { Check } from 'lucide-react'
import type React from 'react'
import type { QuestionOption } from '../../shared/types'

// --- Reusable OptionButton ---

interface OptionButtonProps {
  option: QuestionOption
  selected: boolean
  onSelect: () => void
}

export const OptionButton: React.FC<OptionButtonProps> = ({ option, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full p-5 text-left rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
      selected
        ? 'bg-emerald-50 border-emerald-200 shadow-sm'
        : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-md'
    }`}
  >
    <div>
      <div
        className={`font-medium transition-colors ${selected ? 'text-emerald-800' : 'text-stone-700'}`}
      >
        {option.label}
      </div>
      {option.sublabel && (
        <div className="text-sm text-stone-400 mt-1 font-light">{option.sublabel}</div>
      )}
    </div>
    <div
      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
        selected
          ? 'bg-emerald-500 border-emerald-500 text-white'
          : 'border-stone-200 group-hover:border-stone-300'
      }`}
    >
      {selected && <Check size={14} />}
    </div>
  </button>
)

// --- QuestionStep (uses OptionButton internally) ---

interface QuestionStepProps {
  title: string
  subtitle?: string
  options: QuestionOption[]
  selectedValues: string | string[]
  onSelect: (value: string) => void
  allowMultiple?: boolean
}

export const QuestionStep: React.FC<QuestionStepProps> = ({
  title,
  subtitle,
  options,
  selectedValues,
  onSelect,
  allowMultiple: _allowMultiple = false,
}) => {
  const isSelected = (id: string) => {
    if (Array.isArray(selectedValues)) return selectedValues.includes(id)
    return selectedValues === id
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-light text-stone-800 mb-3">{title}</h2>
        {subtitle && (
          <p className="text-stone-500 text-lg font-light leading-relaxed">{subtitle}</p>
        )}
      </header>

      <div className="space-y-4">
        {options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            selected={isSelected(option.id)}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  )
}
