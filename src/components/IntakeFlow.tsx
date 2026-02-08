
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntake } from '../context/IntakeContext';
import { QuestionStep } from './QuestionStep';
import { ProgressBar } from './ProgressBar';
import { ChevronLeft, ChevronRight, Sparkles, Brain, Zap, Heart, ShieldCheck, RefreshCw } from 'lucide-react';

export const IntakeFlow: React.FC = () => {
  const { currentStep, nextStep, prevStep, state, updateState, setStep } = useIntake();

  const handleToggleValue = (key: string, value: string, multiple = false) => {
    if (multiple) {
      const current = (state as any)[key] as string[];
      const next = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      updateState({ [key]: next });
    } else {
      updateState({ [key]: value });
      // If single select, we might want to auto-advance, but let's keep it manual for skippability
    }
  };

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

      case 1: // Intent
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
              { id: 'stuck', label: 'I don\'t know', sublabel: 'I just feel stuck and need a starting point' }
            ]}
            selectedValues={state.intent}
            onSelect={(val) => handleToggleValue('intent', val, true)}
          />
        );

      case 2: // Drains
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

      case 3: // Capable
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

      case 4: // Avoidance
        return (
          <QuestionStep
            title="Avoidance Pattern"
            subtitle="When you avoid something, what's usually underneath?"
            options={[
              { id: 'energy', label: 'Low energy', sublabel: 'I simply don\'t have the gas in the tank' },
              { id: 'fear', label: 'Fear of doing it wrong', sublabel: 'Worrying about mistakes or failure' },
              { id: 'perfectionism', label: 'Perfectionism', sublabel: 'The bar is so high I can\'t even reach it' },
              { id: 'boredom', label: 'Boredom', sublabel: 'The task just doesn\'t interest me' },
              { id: 'direction', label: 'No starting point', sublabel: 'I don\'t know the very first step' }
            ]}
            selectedValues={state.avoidanceRoot}
            onSelect={(val) => handleToggleValue('avoidanceRoot', val)}
          />
        );

      case 5: // Structure
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

      case 6: // Summary
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-stone-200/50 border border-stone-100 mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={30} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-stone-800">Your Student State Model</h3>
                  <p className="text-stone-400 font-light">Based on your shared reflections</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Assigned Mode</h4>
                      <p className="text-stone-800 font-medium">{state.mode}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Primary Friction</h4>
                      <p className="text-stone-800 font-medium">
                        {state.drains ? state.drains.charAt(0).toUpperCase() + state.drains.slice(1) : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Confidence Loop</h4>
                      <p className="text-stone-800 font-medium">
                        {state.capabilities ? state.capabilities.split('').map((c, i) => i === 0 ? c.toUpperCase() : c).join('') : 'Adaptive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                      <RefreshCw size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Pacing</h4>
                      <p className="text-stone-800 font-medium">
                        {state.structurePref === 'sf' ? 'Scaffold then Release' : state.structurePref === 'fs' ? 'Explore then Consolidate' : 'Steady Pacing'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-stone-600 font-light italic leading-relaxed">
                  "I'll adapt our interaction to focus on {state.intent.join(' and ')}. 
                  We'll start by reducing {state.drains} pressure and focusing on {state.capabilities} to build momentum."
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 flex flex-col">
      {currentStep > 0 && currentStep < 6 && <ProgressBar />}
      
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
        {currentStep > 0 && currentStep < 6 ? (
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
                Skip
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
