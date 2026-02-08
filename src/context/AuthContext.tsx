
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '../types';

interface AuthContextType {
  session: Session | null;
  isLoggingIn: boolean;
  signIn: (provider: 'google') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem('better_auth_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const signIn = async (provider: 'google') => {
    setIsLoggingIn(true);
    // Simulate OAuth Redirect/Popup delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'user_123',
      name: 'Alex Chen',
      email: 'alex.chen@example.com',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      calendarAccess: true
    };

    const newSession: Session = {
      user: mockUser,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    setSession(newSession);
    localStorage.setItem('better_auth_session', JSON.stringify(newSession));
    setIsLoggingIn(false);
  };

  const signOut = async () => {
    setSession(null);
    localStorage.removeItem('better_auth_session');
  };

  return (
    <AuthContext.Provider value={{ session, isLoggingIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useSession must be used within AuthProvider');
  return context;
};
