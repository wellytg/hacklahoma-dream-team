
import React from 'react';
import { IntakeProvider } from './context/IntakeContext';
import { IntakeFlow } from './components/IntakeFlow';

const App: React.FC = () => {
  return (
    <IntakeProvider>
      <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900">
        <IntakeFlow />
      </div>
    </IntakeProvider>
  );
};

export default App;
