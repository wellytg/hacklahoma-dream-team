import type React from 'react'
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'
import type { ConflictOverrides, ResolvedStateModel, StudentStateModel } from '../../shared/types'

interface IntakeContextType {
  currentStep: number
  totalSteps: number
  state: StudentStateModel
  nextStep: () => void
  prevStep: () => void
  updateState: (updates: Partial<StudentStateModel>) => void
  setStep: (step: number) => void
  getResolvedState: () => ResolvedStateModel
}

const DEFAULT_STATE: StudentStateModel = {
  intent: [],
  mode: 'ADAPTIVE',
  drains: '',
  capabilities: '',
  avoidanceRoot: '',
  structurePref: '',
  valueAlignment: '',
  focusTime: '',
  workBurst: '',
  recovery: '',
  learnStyle: '',
  feedbackPref: '',
  reminderPref: '',
  accessNeeds: [],
}

// --- Lookup tables for resolving raw answers to structured data ---

const FRICTION_STRATEGY: Record<string, string> = {
  mental: 'reduce_cognitive_load',
  emotional: 'provide_stability',
  social: 'minimize_collaboration_pressure',
  boring: 'add_variety_gamification',
  decisions: 'reduce_choice_paralysis',
}

const CONFIDENCE_FEEDBACK: Record<string, string> = {
  instructions: 'structured',
  progress: 'visual_metrics',
  encouragement: 'warm_supportive',
  figuring: 'minimal_guidance',
  smallwins: 'micro_task_breakdown',
}

const AVOIDANCE_REFRAME: Record<string, string> = {
  energy: 'schedule_light_tasks',
  fear: 'normalize_mistakes',
  perfectionism: 'set_good_enough_bars',
  boredom: 'add_challenge_variety',
  direction: 'first_step_only',
}

const STRUCTURE_APPROACH: Record<string, string> = {
  sf: 'scaffold_then_release',
  fs: 'explore_then_constrain',
  fulls: 'clear_schedules',
  fullf: 'loose_frameworks',
}

const VALUE_FRAMING: Record<string, string> = {
  learn: 'learning_focused',
  progress: 'movement_focused',
  help: 'contribution_focused',
  rest: 'rest_validated',
  meaningful: 'impact_over_activity',
}

const ACCESSIBILITY_ADAPTATIONS: Record<string, string> = {
  starting: 'smaller_first_steps',
  remembering: 'step_reminders',
  sensory: 'reduced_stimulation',
  hyperfocus: 'break_reminders',
  anxiety: 'lower_stakes_framing',
}

// --- Resolve raw answers into structured state ---

function resolveState(raw: StudentStateModel): ResolvedStateModel {
  const friction = {
    primary: raw.drains || 'unknown',
    secondary: [] as string[],
    strategy: FRICTION_STRATEGY[raw.drains] || 'observe_and_adapt',
  }

  const confidence = {
    builder: raw.capabilities || 'adaptive',
    feedback_style: CONFIDENCE_FEEDBACK[raw.capabilities] || 'balanced',
  }

  const avoidance = {
    root_cause: raw.avoidanceRoot || 'unknown',
    reframe: AVOIDANCE_REFRAME[raw.avoidanceRoot] || 'gentle_exploration',
  }

  const scaffolding = {
    preference: raw.structurePref || 'adaptive',
    approach: STRUCTURE_APPROACH[raw.structurePref] || 'light_scaffold',
  }

  const values = {
    meaningful_day: raw.valueAlignment || 'progress',
    productivity_framing: VALUE_FRAMING[raw.valueAlignment] || 'movement_focused',
  }

  const rhythm =
    raw.focusTime || raw.workBurst || raw.recovery
      ? {
          focus_time: raw.focusTime || 'unpredictable',
          work_burst: raw.workBurst || '25',
          recovery: raw.recovery || 'rest',
        }
      : null

  const learning =
    raw.learnStyle || raw.feedbackPref || raw.reminderPref
      ? {
          style: raw.learnStyle || 'explanation-first',
          feedback: raw.feedbackPref || 'encouraging',
          reminders: raw.reminderPref || 'gentle',
        }
      : null

  const accessibility =
    raw.accessNeeds.length > 0
      ? {
          needs: raw.accessNeeds,
          adaptations: raw.accessNeeds.map((n) => ACCESSIBILITY_ADAPTATIONS[n]).filter(Boolean),
        }
      : null

  const overrides = resolveConflicts(raw)

  return {
    intent: raw.intent,
    mode: raw.mode,
    friction,
    confidence,
    avoidance,
    scaffolding,
    values,
    rhythm,
    learning,
    accessibility,
    overrides,
  }
}

// --- Conflict resolution ---

function resolveConflicts(raw: StudentStateModel): ConflictOverrides {
  const overrides: ConflictOverrides = {}

  if (
    raw.workBurst === '60+' &&
    (raw.avoidanceRoot === 'energy' || raw.accessNeeds.includes('hyperfocus'))
  ) {
    overrides.energy_paradox = {
      active: true,
      note: 'You prefer long focus sessions but also report energy challenges — starting with shorter bursts to protect your energy.',
    }
  }

  if (raw.capabilities === 'figuring' && (raw.drains === 'mental' || raw.drains === 'decisions')) {
    overrides.autonomy_vs_need = {
      active: true,
      note: 'You like figuring things out independently but cognitive effort drains you — providing light structure with room to explore.',
    }
  }

  if (
    (raw.structurePref === 'fullf' || raw.structurePref === 'fs') &&
    (raw.accessNeeds.includes('starting') || raw.accessNeeds.includes('remembering'))
  ) {
    overrides.flexibility_exec_conflict = {
      active: true,
      note: 'You prefer flexibility but report trouble with starting or remembering — adding light scaffolding to support your flow.',
    }
  }

  if (raw.drains === 'social' && raw.capabilities === 'helping') {
    overrides.social_contradiction = {
      active: true,
      note: 'Social interaction drains you but helping others builds your confidence — focusing on async or low-pressure ways to contribute.',
    }
  }

  return overrides
}

const IntakeContext = createContext<IntakeContextType | undefined>(undefined)

export const IntakeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [state, setState] = useState<StudentStateModel>(DEFAULT_STATE)
  const totalSteps = 11

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))
  const setStep = (step: number) => setCurrentStep(step)

  const updateState = (updates: Partial<StudentStateModel>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates }

      if (updates.intent) {
        if (updates.intent.includes('consistency')) newState.mode = 'COACH'
        else if (updates.intent.includes('starting')) newState.mode = 'IGNITION'
        else if (updates.intent.includes('energy')) newState.mode = 'PACER'
        else if (updates.intent.includes('overwhelm')) newState.mode = 'STABILIZER'
        else newState.mode = 'ADAPTIVE'
      }

      return newState
    })
  }

  const getResolvedState = useCallback(() => resolveState(state), [state])

  return (
    <IntakeContext.Provider
      value={{
        currentStep,
        totalSteps,
        state,
        nextStep,
        prevStep,
        updateState,
        setStep,
        getResolvedState,
      }}
    >
      {children}
    </IntakeContext.Provider>
  )
}

export const useIntake = () => {
  const context = useContext(IntakeContext)
  if (!context) throw new Error('useIntake must be used within IntakeProvider')
  return context
}
