
import React, { createContext, useContext, ReactNode } from 'react';

const EmptyContext = createContext({});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <EmptyContext.Provider value={{}}>{children}</EmptyContext.Provider>;
};

export const useTheme = () => useContext(EmptyContext);
