
export type PersonaMode = 'COACH' | 'IGNITION' | 'PACER' | 'STABILIZER' | 'ADAPTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  calendarAccess: boolean;
}

export interface Session {
  user: User;
  expires: number;
}

export interface FrictionMap {
  primary: string;
  secondary: string[];
  strategy: string;
}

export interface ConfidenceLoop {
  builder: string;
  feedback_style: string;
}

export interface AvoidancePattern {
  root_cause: string;
  reframe: string;
}

export interface ScaffoldingStrategy {
  preference: string;
  approach: string;
}

export interface ValueAlignment {
  meaningful_day: string;
  productivity_framing: string;
}

export interface RhythmProfile {
  focus_time: string;
  work_burst: string;
  recovery: string;
}

export interface LearningPreferences {
  style: string;
  feedback: string;
  reminders: string;
}

export interface AccessibilityProfile {
  needs: string[];
  adaptations: string[];
}

export interface ConflictOverrides {
  [key: string]: { active: boolean; note: string };
}

export interface RawAnswers {
  intent: string[];
  mode: PersonaMode;
  drains: string;
  capabilities: string;
  avoidanceRoot: string;
  structurePref: string;
  valueAlignment: string;
  focusTime: string;
  workBurst: string;
  recovery: string;
  learnStyle: string;
  feedbackPref: string;
  reminderPref: string;
  accessNeeds: string[];
}

export interface ResolvedStateModel {
  intent: string[];
  mode: PersonaMode;
  friction: FrictionMap;
  confidence: ConfidenceLoop;
  avoidance: AvoidancePattern;
  scaffolding: ScaffoldingStrategy;
  values: ValueAlignment;
  rhythm: RhythmProfile | null;
  learning: LearningPreferences | null;
  accessibility: AccessibilityProfile | null;
  overrides: ConflictOverrides;
}

export type StudentStateModel = RawAnswers;

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: number; // in minutes
  description: string;
  type: 'focus' | 'break' | 'review';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'event_proposal' | 'path_proposal';
  eventData?: CalendarEvent;
  pathData?: CalendarEvent[];
}
