
import React, { useState, useEffect } from 'react';
import { IntakeProvider } from './context/IntakeContext';
import { CalendarProvider } from './context/CalendarContext';
import { AuthProvider, useSession } from './context/AuthContext';
import { IntakeFlow } from './components/IntakeFlow';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { session, signOut } = useSession();
  const [view, setView] = useState<'intake' | 'dashboard'>('intake');

  useEffect(() => {
    const profileCompleted = localStorage.getItem('sensei_profile_completed');
    if (profileCompleted && session) {
      setView('dashboard');
    } else {
      setView('intake');
    }
  }, [session]);

  const handleIntakeComplete = () => {
    localStorage.setItem('sensei_profile_completed', 'true');
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('sensei_profile_completed');
    signOut();
    setView('intake');
  };

  return (
    <div className="min-h-screen selection:bg-emerald-100 selection:text-emerald-900 bg-stone-50">
      {view === 'intake' ? (
        <IntakeFlow onComplete={handleIntakeComplete} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IntakeProvider>
        <CalendarProvider>
          <AppContent />
        </CalendarProvider>
      </IntakeProvider>
    </AuthProvider>
  );
};

export default App;
