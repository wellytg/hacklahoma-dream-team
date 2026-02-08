
export type PersonaMode = 'COACH' | 'IGNITION' | 'PACER' | 'STABILIZER' | 'ADAPTIVE';

export interface StudentStateModel {
  intent: string[];
  mode: PersonaMode;
  drains: string;
  capabilities: string;
  avoidanceRoot: string;
  structurePref: string;
  valueAlignment: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
}

export interface IntakeQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  allowMultiple?: boolean;
}
