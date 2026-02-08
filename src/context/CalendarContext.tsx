
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarEvent } from '../types';

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  addPath: (events: Omit<CalendarEvent, 'id'>[]) => void;
  removeEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'initial-1',
      title: 'Morning Reflection',
      startTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      duration: 15,
      description: 'Set the tone for a meaningful day.',
      type: 'review'
    }
  ]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ));
  };

  const addPath = (newEvents: Omit<CalendarEvent, 'id'>[]) => {
    const withIds = newEvents.map(e => ({ ...e, id: Math.random().toString(36).substr(2, 9) }));
    setEvents(prev => [...prev, ...withIds].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    ));
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, addPath, removeEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within CalendarProvider');
  return context;
};
