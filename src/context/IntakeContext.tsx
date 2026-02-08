
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StudentStateModel, PersonaMode } from '../types';

interface IntakeContextType {
  currentStep: number;
  totalSteps: number;
  state: StudentStateModel;
  nextStep: () => void;
  prevStep: () => void;
  updateState: (updates: Partial<StudentStateModel>) => void;
  setStep: (step: number) => void;
}

const DEFAULT_STATE: StudentStateModel = {
  intent: [],
  mode: 'ADAPTIVE',
  drains: '',
  capabilities: '',
  avoidanceRoot: '',
  structurePref: '',
  valueAlignment: ''
};

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<StudentStateModel>(DEFAULT_STATE);
  const totalSteps = 7; // 0 to 6

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const setStep = (step: number) => setCurrentStep(step);

  const updateState = (updates: Partial<StudentStateModel>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      
      // Determine mode based on intent if it was updated
      if (updates.intent) {
        if (updates.intent.includes('consistency')) newState.mode = 'COACH';
        else if (updates.intent.includes('starting')) newState.mode = 'IGNITION';
        else if (updates.intent.includes('energy')) newState.mode = 'PACER';
        else if (updates.intent.includes('overwhelm')) newState.mode = 'STABILIZER';
        else newState.mode = 'ADAPTIVE';
      }
      
      return newState;
    });
  };

  return (
    <IntakeContext.Provider value={{ currentStep, totalSteps, state, nextStep, prevStep, updateState, setStep }}>
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => {
  const context = useContext(IntakeContext);
  if (!context) throw new Error('useIntake must be used within IntakeProvider');
  return context;
};
