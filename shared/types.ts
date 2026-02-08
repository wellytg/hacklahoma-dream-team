export type PersonaMode = 'COACH' | 'IGNITION' | 'PACER' | 'STABILIZER' | 'ADAPTIVE'

// --- Structured sub-models ---

export interface FrictionMap {
  primary: string
  secondary: string[]
  strategy: string
}

export interface ConfidenceLoop {
  builder: string
  feedback_style: string
}

export interface AvoidancePattern {
  root_cause: string
  reframe: string
}

export interface ScaffoldingStrategy {
  preference: string
  approach: string
}

export interface ValueAlignment {
  meaningful_day: string
  productivity_framing: string
}

export interface RhythmProfile {
  focus_time: string
  work_burst: string
  recovery: string
}

export interface LearningPreferences {
  style: string
  feedback: string
  reminders: string
}

export interface AccessibilityProfile {
  needs: string[]
  adaptations: string[]
}

export interface ConflictOverrides {
  [key: string]: { active: boolean; note: string }
}

// --- Raw answers (flat, written by question handlers) ---

export interface RawAnswers {
  intent: string[]
  mode: PersonaMode
  drains: string
  capabilities: string
  avoidanceRoot: string
  structurePref: string
  valueAlignment: string
  // Energy & Rhythm (optional)
  focusTime: string
  workBurst: string
  recovery: string
  // Learning & Support (optional)
  learnStyle: string
  feedbackPref: string
  reminderPref: string
  // Accessibility (optional)
  accessNeeds: string[]
}

// --- Resolved state model (computed from raw answers) ---

export interface ResolvedStateModel {
  intent: string[]
  mode: PersonaMode
  friction: FrictionMap
  confidence: ConfidenceLoop
  avoidance: AvoidancePattern
  scaffolding: ScaffoldingStrategy
  values: ValueAlignment
  rhythm: RhythmProfile | null
  learning: LearningPreferences | null
  accessibility: AccessibilityProfile | null
  overrides: ConflictOverrides
}

// Keep StudentStateModel as alias for RawAnswers
export type StudentStateModel = RawAnswers

// --- Question types ---

export interface QuestionOption {
  id: string
  label: string
  sublabel?: string
}

export interface IntakeQuestion {
  id: string
  title: string
  subtitle?: string
  options: QuestionOption[]
  allowMultiple?: boolean
}

// --- User & Auth types ---

export interface User {
  id: string
  email: string
  name: string
}

// --- Chat types ---

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

// --- Scheduled Actions ---

export interface ScheduledAction {
  id: string
  title: string
  description: string | null
  scheduledAt: string
  durationMinutes: number | null
  goalArea: string | null
  status: string | null
  reflectionScheduledAt: string | null
  calendarHtmlLink: string | null
}

// --- Reflection Records ---

export interface ReflectionRecord {
  id: string
  actionId: string
  completed: string
  userSummary: string | null
  barriers: string | null
  emotionalTone: string | null
  wantsToRepeat: string | null
  createdAt: string | null
}
