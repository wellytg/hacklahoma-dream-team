/**
 * Shared state resolution logic.
 *
 * Resolves raw intake answers into structured state, with lookup tables
 * and human-readable labels. Used by both IntakeContext and Profile page.
 */

import type { ConflictOverrides, ResolvedStateModel, StudentStateModel } from './types'

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

// --- Human-readable label map ---

export const LABEL: Record<string, string> = {
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
  mental: 'Mental effort',
  emotional: 'Emotional effort',
  social: 'Social interaction',
  boring: 'Boring/repetitive tasks',
  decisions: 'Decision-making',
  instructions: 'Clear instructions',
  progress: 'Seeing progress',
  encouragement: 'Encouragement',
  figuring: 'Figuring it out',
  smallwins: 'Small wins',
  energy: 'Low energy',
  fear: 'Fear of doing it wrong',
  perfectionism: 'Perfectionism',
  boredom: 'Boredom',
  direction: 'No starting point',
  // Structure prefs
  sf: 'Structure then Freedom',
  fs: 'Freedom then Structure',
  fulls: 'Mostly Structure',
  fullf: 'Mostly Flexibility',
  // Value alignment
  learn: 'Learning',
  help: 'Helping others',
  rest: 'Rest',
  meaningful: 'Meaningful impact',
  // Rhythm
  morning: 'Morning',
  afternoon: 'Afternoon',
  night: 'Night',
  unpredictable: 'Unpredictable',
  '15-25': '15-25 min',
  '30-45': '30-45 min',
  '60+': '60+ min',
  movement: 'Movement',
  distraction: 'Distraction',
  switching: 'Task switching',
  // Learning
  'explanation-first': 'Explanation first',
  'example-first': 'Example first',
  'trying-first': 'Trying first',
  encouraging: 'Encouraging',
  direct: 'Direct',
  minimal: 'Minimal',
  gentle: 'Gentle nudges',
  firm: 'Firm check-ins',
  'only-when-asked': 'Only when asked',
  // Accessibility
  starting: 'Trouble starting',
  remembering: 'Trouble remembering',
  sensory: 'Sensory overwhelm',
  hyperfocus: 'Hyperfocus/crash',
  anxiety: 'Performance anxiety',
}

/** Resolve a key to a human-readable label, falling back to title case. */
export function label(key: string): string {
  return LABEL[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
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

// --- Main resolver ---

export function resolveState(raw: StudentStateModel): ResolvedStateModel {
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
