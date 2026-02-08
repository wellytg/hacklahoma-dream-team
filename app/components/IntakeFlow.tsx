
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntake } from '~/context/IntakeContext';
import { QuestionStep, OptionButton } from './QuestionStep';
import { ProgressBar } from './ProgressBar';
import {
  ChevronLeft, ChevronRight, Sparkles, Brain, Zap, Heart,
  ShieldCheck, RefreshCw, Clock, BookOpen, Accessibility, AlertTriangle
} from 'lucide-react';

// --- Helper: human-readable labels for resolved values ---

const LABEL: Record<string, string> = {
  // Friction strategies
  reduce_cognitive_load: 'Reduce cognitive load',
  provide_stability: 'Provide emotional stability',
  minimize_collaboration_pressure: 'Minimize social pressure',
  add_variety_gamification: 'Add variety & gamification',
  reduce_choice_paralysis: 'Reduce choice paralysis',
  observe_and_adapt: 'Observe & adapt',
  // Confidence feedback
  structured: 'Structured, step-by-step',
  visual_metrics: 'Visual progress markers',
  warm_supportive: 'Warm & supportive',
  minimal_guidance: 'Minimal — autonomy-first',
  micro_task_breakdown: 'Micro-task breakdown',
  balanced: 'Balanced',
  // Avoidance reframes
  schedule_light_tasks: 'Schedule lighter tasks',
  normalize_mistakes: 'Normalize mistakes',
  set_good_enough_bars: 'Set "good enough" bars',
  add_challenge_variety: 'Add challenge & variety',
  first_step_only: 'Show first step only',
  gentle_exploration: 'Gentle exploration',
  // Scaffolding approaches
  scaffold_then_release: 'Scaffold then release',
  explore_then_constrain: 'Explore then consolidate',
  clear_schedules: 'Clear schedules',
  loose_frameworks: 'Loose frameworks',
  light_scaffold: 'Light scaffolding',
  // Value framing
  learning_focused: 'Frame as learning',
  movement_focused: 'Emphasize movement',
  contribution_focused: 'Highlight contribution',
  rest_validated: 'Validate rest as productive',
  impact_over_activity: 'Focus on impact over activity',
  // Drains / capabilities / avoidance roots
  mental: 'Mental effort', emotional: 'Emotional effort', social: 'Social interaction',
  boring: 'Boring/repetitive tasks', decisions: 'Decision-making',
  instructions: 'Clear instructions', progress: 'Seeing progress',
  encouragement: 'Encouragement', figuring: 'Figuring it out',
  smallwins: 'Small wins',
  energy: 'Low energy', fear: 'Fear of doing it wrong',
  perfectionism: 'Perfectionism', boredom: 'Boredom', direction: 'No starting point',
  // Structure prefs
  sf: 'Structure then Freedom', fs: 'Freedom then Structure',
  fulls: 'Mostly Structure', fullf: 'Mostly Flexibility',
  // Value alignment
  learn: 'Learning', help: 'Helping others', rest: 'Rest', meaningful: 'Meaningful impact',
  // Rhythm
  morning: 'Morning', afternoon: 'Afternoon', night: 'Night', unpredictable: 'Unpredictable',
  '15-25': '15-25 min', '30-45': '30-45 min', '60+': '60+ min',
  movement: 'Movement', distraction: 'Distraction', switching: 'Task switching',
  // Learning
  'explanation-first': 'Explanation first', 'example-first': 'Example first', 'trying-first': 'Trying first',
  encouraging: 'Encouraging', direct: 'Direct', minimal: 'Minimal',
  gentle: 'Gentle nudges', firm: 'Firm check-ins', 'only-when-asked': 'Only when asked',
  // Accessibility
  starting: 'Trouble starting', remembering: 'Trouble remembering',
  sensory: 'Sensory overwhelm', hyperfocus: 'Hyperfocus/crash', anxiety: 'Performance anxiety',
};

const label = (key: string) => LABEL[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');

// --- Sub-question component for optional module steps ---

interface SubQuestionProps {
  title: string;
  options: { id: string; label: string }[];
  selected: string;
  onSelect: (id: string) => void;
}

const SubQuestion: React.FC<SubQuestionProps> = ({ title, options, selected, onSelect }) => (
  <div className="mb-8">
    <h3 className="text-sm uppercase tracking-widest text-stone-400 font-semibold mb-3">{title}</h3>
    <div className="space-y-3">
      {options.map(opt => (
        <OptionButton
          key={opt.id}
          option={{ id: opt.id, label: opt.label }}
          selected={selected === opt.id}
          onSelect={() => onSelect(opt.id)}
        />
      ))}
    </div>
  </div>
);

// --- Main IntakeFlow ---

export const IntakeFlow: React.FC = () => {
  const { currentStep, nextStep, prevStep, state, updateState, setStep, getResolvedState } = useIntake();

  const handleToggleValue = (key: string, value: string, multiple = false) => {
    if (multiple) {
      const current = (state as any)[key] as string[];
      const next = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      updateState({ [key]: next });
    } else {
      updateState({ [key]: value });
    }
  };

  // Accessibility "none" exclusivity handler
  const handleAccessToggle = (value: string) => {
    if (value === 'none') {
      updateState({ accessNeeds: ['none'] });
      return;
    }
    const current = state.accessNeeds.filter(v => v !== 'none');
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateState({ accessNeeds: next });
  };

  const isOptionalStep = currentStep >= 7 && currentStep <= 9;

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Intro
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 text-emerald-600">
              <Sparkles size={40} />
            </div>
            <h1 className="text-4xl font-serif font-light text-stone-800 mb-6">Hello there.</h1>
            <p className="text-stone-500 text-lg leading-relaxed mb-10 font-light">
              I'll ask a few questions to support you better. No right answers, no psych jargon. You can skip anything you like.
            </p>
            <button
              onClick={nextStep}
              className="px-10 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
            >
              Help me help you
            </button>
          </motion.div>
        );

      case 1: // Q1: Intent
        return (
          <QuestionStep
            title="The Big Why"
            subtitle="What do you want help with right now?"
            allowMultiple
            options={[
              { id: 'consistency', label: 'Staying consistent', sublabel: 'Habit formation & accountability' },
              { id: 'starting', label: 'Starting tasks', sublabel: 'Overcoming that initial activation energy' },
              { id: 'energy', label: 'Managing energy', sublabel: 'Working with your natural rhythms' },
              { id: 'overwhelm', label: 'Reducing overwhelm', sublabel: 'Simplification & mental stability' },
              { id: 'stuck', label: "I don't know", sublabel: 'I just feel stuck and need a starting point' }
            ]}
            selectedValues={state.intent}
            onSelect={(val) => handleToggleValue('intent', val, true)}
          />
        );

      case 2: // Q2: Drains
        return (
          <QuestionStep
            title="Intrinsic Core"
            subtitle="What drains you faster than it should?"
            options={[
              { id: 'mental', label: 'Mental effort', sublabel: 'Deep concentration & learning' },
              { id: 'emotional', label: 'Emotional effort', sublabel: 'Navigating feelings & stress' },
              { id: 'social', label: 'Social stuff', sublabel: 'Interacting, collaborating, or people pressure' },
              { id: 'boring', label: 'Boring tasks', sublabel: 'Repetitive, low-novelty work' },
              { id: 'decisions', label: 'Decision-making', sublabel: 'Choosing what to do next' }
            ]}
            selectedValues={state.drains}
            onSelect={(val) => handleToggleValue('drains', val)}
          />
        );

      case 3: // Q3: Capable
        return (
          <QuestionStep
            title="Feeling Capable"
            subtitle="What makes you feel competent pretty quickly?"
            options={[
              { id: 'instructions', label: 'Clear instructions', sublabel: 'Knowing exactly what to do' },
              { id: 'progress', label: 'Seeing progress', sublabel: 'Visual markers of movement' },
              { id: 'encouragement', label: 'Encouragement', sublabel: 'Warm feedback and support' },
              { id: 'figuring', label: 'Figuring it out', sublabel: 'Autonomy and self-discovery' },
              { id: 'smallwins', label: 'Small wins', sublabel: 'Checking off micro-tasks' }
            ]}
            selectedValues={state.capabilities}
            onSelect={(val) => handleToggleValue('capabilities', val)}
          />
        );

      case 4: // Q4: Avoidance
        return (
          <QuestionStep
            title="Avoidance Pattern"
            subtitle="When you avoid something, what's usually underneath?"
            options={[
              { id: 'energy', label: 'Low energy', sublabel: "I simply don't have the gas in the tank" },
              { id: 'fear', label: 'Fear of doing it wrong', sublabel: 'Worrying about mistakes or failure' },
              { id: 'perfectionism', label: 'Perfectionism', sublabel: "The bar is so high I can't even reach it" },
              { id: 'boredom', label: 'Boredom', sublabel: "The task just doesn't interest me" },
              { id: 'direction', label: 'No starting point', sublabel: "I don't know the very first step" }
            ]}
            selectedValues={state.avoidanceRoot}
            onSelect={(val) => handleToggleValue('avoidanceRoot', val)}
          />
        );

      case 5: // Q5: Structure
        return (
          <QuestionStep
            title="Structure vs Flexibility"
            subtitle="What's your preferred way to work?"
            options={[
              { id: 'sf', label: 'Structure then Freedom', sublabel: 'Guide me first, then let me go' },
              { id: 'fs', label: 'Freedom then Structure', sublabel: 'Let me explore, then help me organize' },
              { id: 'fulls', label: 'Mostly Structure', sublabel: 'I thrive on clear schedules' },
              { id: 'fullf', label: 'Mostly Flexibility', sublabel: 'I need room to breathe and pivot' }
            ]}
            selectedValues={state.structurePref}
            onSelect={(val) => handleToggleValue('structurePref', val)}
          />
        );

      case 6: // Q6: Wasted Day
        return (
          <QuestionStep
            title="A Wasted Day"
            subtitle='When does a day feel "wasted" to you?'
            options={[
              { id: 'learn', label: "I didn't learn anything", sublabel: 'Growth and discovery matter most' },
              { id: 'progress', label: "I didn't make progress", sublabel: 'Forward movement is what counts' },
              { id: 'help', label: "I didn't help anyone", sublabel: 'Contribution gives meaning' },
              { id: 'rest', label: "I didn't rest", sublabel: 'Recovery is productive too' },
              { id: 'meaningful', label: "Busy but it didn't matter", sublabel: 'Impact over activity' }
            ]}
            selectedValues={state.valueAlignment}
            onSelect={(val) => handleToggleValue('valueAlignment', val)}
          />
        );

      case 7: // Energy & Rhythm (optional, 3 sub-questions)
        return (
          <div className="max-w-2xl mx-auto">
            <header className="mb-10 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
                <Clock size={28} />
              </div>
              <h2 className="text-3xl font-serif font-light text-stone-800 mb-3">Energy & Rhythm</h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed">This helps me suggest better timing. Skip if you want.</p>
            </header>

            <SubQuestion
              title="Best focus time"
              options={[
                { id: 'morning', label: 'Morning' },
                { id: 'afternoon', label: 'Afternoon' },
                { id: 'night', label: 'Night' },
                { id: 'unpredictable', label: 'Unpredictable' }
              ]}
              selected={state.focusTime}
              onSelect={(val) => updateState({ focusTime: val })}
            />

            <SubQuestion
              title="Ideal work burst"
              options={[
                { id: '15-25', label: '15-25 minutes' },
                { id: '30-45', label: '30-45 minutes' },
                { id: '60+', label: '60+ minutes' }
              ]}
              selected={state.workBurst}
              onSelect={(val) => updateState({ workBurst: val })}
            />

            <SubQuestion
              title="Recovery style"
              options={[
                { id: 'rest', label: 'Rest & stillness' },
                { id: 'movement', label: 'Movement' },
                { id: 'distraction', label: 'Distraction (scroll, music)' },
                { id: 'switching', label: 'Switching tasks' }
              ]}
              selected={state.recovery}
              onSelect={(val) => updateState({ recovery: val })}
            />
          </div>
        );

      case 8: // Learning & Support (optional, 3 sub-questions)
        return (
          <div className="max-w-2xl mx-auto">
            <header className="mb-10 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <BookOpen size={28} />
              </div>
              <h2 className="text-3xl font-serif font-light text-stone-800 mb-3">Learning & Support</h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed">How do you learn and receive feedback best?</p>
            </header>

            <SubQuestion
              title="I learn best by"
              options={[
                { id: 'explanation-first', label: 'Explanation first, then example' },
                { id: 'example-first', label: 'Example first, then explanation' },
                { id: 'trying-first', label: 'Trying it first' }
              ]}
              selected={state.learnStyle}
              onSelect={(val) => updateState({ learnStyle: val })}
            />

            <SubQuestion
              title="Feedback style"
              options={[
                { id: 'encouraging', label: 'Encouraging' },
                { id: 'direct', label: 'Direct' },
                { id: 'minimal', label: 'Minimal' }
              ]}
              selected={state.feedbackPref}
              onSelect={(val) => updateState({ feedbackPref: val })}
            />

            <SubQuestion
              title="Reminders"
              options={[
                { id: 'gentle', label: 'Gentle nudges' },
                { id: 'firm', label: 'Firm check-ins' },
                { id: 'only-when-asked', label: 'Only when I ask' }
              ]}
              selected={state.reminderPref}
              onSelect={(val) => updateState({ reminderPref: val })}
            />
          </div>
        );

      case 9: // Accessibility & Friction (optional, multi-select with none-exclusivity)
        return (
          <QuestionStep
            title="Accessibility & Friction"
            subtitle="You don't need a diagnosis for this."
            allowMultiple
            options={[
              { id: 'starting', label: 'Trouble starting tasks' },
              { id: 'remembering', label: 'Trouble remembering steps' },
              { id: 'sensory', label: 'Sensory overwhelm' },
              { id: 'hyperfocus', label: 'Hyperfocus then crash' },
              { id: 'anxiety', label: 'Anxiety around performance' },
              { id: 'none', label: 'None of these / prefer not to say' }
            ]}
            selectedValues={state.accessNeeds}
            onSelect={handleAccessToggle}
          />
        );

      case 10: { // Summary
        const resolved = getResolvedState();
        const hasOverrides = Object.keys(resolved.overrides).length > 0;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-stone-200/50 border border-stone-100 mb-10">
              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-stone-800">Here's how I'll support you</h3>
                  <p className="text-stone-400 font-light">You can change any of this later.</p>
                </div>
              </div>

              {/* Core sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                  <SummaryItem icon={<Zap size={20} />} title="Mode" value={resolved.mode} />
                  <SummaryItem icon={<Brain size={20} />} title="Primary Friction" value={label(resolved.friction.primary)} sub={resolved.friction.strategy !== 'observe_and_adapt' ? `Strategy: ${label(resolved.friction.strategy)}` : undefined} />
                  <SummaryItem icon={<Heart size={20} />} title="Confidence Loop" value={label(resolved.confidence.builder)} sub={`Feedback: ${label(resolved.confidence.feedback_style)}`} />
                </div>

                {/* Right column */}
                <div className="space-y-6">
                  <SummaryItem icon={<RefreshCw size={20} />} title="Avoidance Reframe" value={label(resolved.avoidance.root_cause)} sub={label(resolved.avoidance.reframe)} />
                  <SummaryItem icon={<ShieldCheck size={20} />} title="Scaffolding" value={label(resolved.scaffolding.preference)} sub={label(resolved.scaffolding.approach)} />
                  <SummaryItem icon={<Sparkles size={20} />} title="Value Alignment" value={label(resolved.values.meaningful_day)} sub={label(resolved.values.productivity_framing)} />
                </div>
              </div>

              {/* Optional modules */}
              {(resolved.rhythm || resolved.learning || resolved.accessibility) && (
                <div className="mt-8 pt-8 border-t border-stone-100 space-y-6">
                  {resolved.rhythm && (
                    <div className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Rhythm</h4>
                        <p className="text-stone-700 text-sm">
                          Focus: {label(resolved.rhythm.focus_time)} &middot; Burst: {label(resolved.rhythm.work_burst)} &middot; Recovery: {label(resolved.rhythm.recovery)}
                        </p>
                      </div>
                    </div>
                  )}
                  {resolved.learning && (
                    <div className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Learning</h4>
                        <p className="text-stone-700 text-sm">
                          Style: {label(resolved.learning.style)} &middot; Feedback: {label(resolved.learning.feedback)} &middot; Reminders: {label(resolved.learning.reminders)}
                        </p>
                      </div>
                    </div>
                  )}
                  {resolved.accessibility && (
                    <div className="flex gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                        <Accessibility size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Accessibility</h4>
                        <p className="text-stone-700 text-sm">
                          {resolved.accessibility.needs.map(n => label(n)).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conflict overrides */}
              {hasOverrides && (
                <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800">Adjustments based on your answers</h4>
                  </div>
                  <div className="space-y-2">
                    {(Object.entries(resolved.overrides) as [string, { active: boolean; note: string }][])
                      .filter(([, o]) => o.active)
                      .map(([key, override]) => (
                        <p key={key} className="text-amber-700 text-sm font-light">{override.note}</p>
                      ))}
                  </div>
                </div>
              )}

              {/* Summary paragraph */}
              <div className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-stone-600 font-light italic leading-relaxed">
                  "I'll adapt our interaction to focus on {state.intent.length > 0 ? state.intent.map(i => label(i)).join(' and ') : 'finding your rhythm'}.
                  We'll start by reducing {label(resolved.friction.primary).toLowerCase()} pressure and focusing on {label(resolved.confidence.builder).toLowerCase()} to build momentum."
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(0)}
                className="text-stone-400 hover:text-stone-600 transition-colors text-sm font-medium tracking-wide"
              >
                Reset and restart flow
              </button>
            </div>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col">
      {currentStep > 0 && currentStep < 10 && <ProgressBar />}

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="mt-12 flex items-center justify-between max-w-2xl mx-auto w-full">
        {currentStep > 0 && currentStep < 10 ? (
          <>
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors font-medium"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <div className="flex gap-4">
              <button
                onClick={nextStep}
                className="text-stone-400 hover:text-stone-600 transition-colors font-medium"
              >
                {isOptionalStep ? 'Skip section' : 'Skip'}
              </button>
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </>
        ) : null}
      </footer>
    </div>
  );
};

// --- Summary helper component ---

const SummaryItem: React.FC<{ icon: React.ReactNode; title: string; value: string; sub?: string }> = ({ icon, title, value, sub }) => (
  <div className="flex gap-4">
    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
      {icon}
    </div>
    <div>
      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">{title}</h4>
      <p className="text-stone-800 font-medium">{value}</p>
      {sub && <p className="text-stone-500 text-sm font-light mt-0.5">{sub}</p>}
    </div>
  </div>
);
