
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SenseiChat } from './SenseiChat';
import { useIntake } from '../context/IntakeContext';
import { useCalendar } from '../context/CalendarContext';
import { useSession } from '../context/AuthContext';
import { LogOut, Calendar, Layout, UserCircle, Clock, Trash2, User } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'profile'>('dashboard');
  const { getResolvedState } = useIntake();
  const { session } = useSession();
  const profile = getResolvedState();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 flex flex-col z-40">
        <div className="p-8">
          <h2 className="text-2xl font-serif italic text-emerald-600 font-bold">Sensei</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<Layout size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Calendar size={18} />} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <NavItem icon={<UserCircle size={18} />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="p-4 bg-stone-50 rounded-2xl mb-4 flex items-center gap-3">
            {session?.user.image ? (
              <img src={session.user.image} className="w-10 h-10 rounded-xl bg-white shadow-sm" alt="User" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center text-stone-500">
                <User size={20} />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs uppercase tracking-widest text-stone-400 font-bold truncate">Student</p>
              <p className="text-stone-800 font-medium text-sm truncate">{session?.user.name || 'Anonymous'}</p>
            </div>
          </div>
          
          <div className="px-4 mb-4">
             <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Mode: {profile.mode}
             </div>
          </div>

          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-stone-400 hover:text-red-500 transition-colors text-sm">
            <LogOut size={16} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <header className="h-16 border-b border-stone-200 glass sticky top-0 z-30 flex items-center justify-between px-8">
          <div className="text-sm text-stone-400 font-light italic">
            {activeTab === 'dashboard' && `"The focus is within, ${session?.user.name.split(' ')[0]}."`}
            {activeTab === 'calendar' && `"Structure is the skeleton of freedom."`}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <section className="flex-1 flex flex-col bg-stone-50/50 max-w-4xl mx-auto w-full relative">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <SenseiChat profile={profile} />
                </motion.div>
              )}
              {activeTab === 'calendar' && (
                <motion.div key="calendar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-8 overflow-y-auto h-full">
                   <CalendarView />
                </motion.div>
              )}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-12 text-center text-stone-400 italic">
                  Profile adjustments coming soon.
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {activeTab === 'dashboard' && (
            <aside className="hidden xl:flex w-80 border-l border-stone-200 bg-white p-8 flex-col gap-8 overflow-y-auto">
               <div>
                 <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">Upcoming</h3>
                 <CompactSchedule />
               </div>
               <div>
                 <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-4">Student State</h3>
                 <div className="space-y-4">
                   <StateProgress label="Energy" value={70} color="amber" />
                   <StateProgress label="Focus" value={85} color="emerald" />
                   <StateProgress label="Confidence" value={45} color="blue" />
                 </div>
               </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
    active ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-stone-500 hover:bg-stone-50'
  }`}>
    {icon} <span>{label}</span>
  </button>
);

const CalendarView: React.FC = () => {
  const { events, removeEvent } = useCalendar();
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-light text-stone-800">Your Schedule</h2>
      </header>
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-20 text-stone-300 font-serif italic text-xl">Empty path. Talk to Sensei to build one.</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex gap-6 group">
              <div className="w-16 text-right pt-1">
                <div className="text-sm font-bold text-stone-900">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-[10px] text-stone-400 uppercase tracking-tighter">{event.duration}m</div>
              </div>
              <div className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'focus' ? 'bg-emerald-500' : 
                      event.type === 'break' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <h4 className="font-bold text-stone-800">{event.title}</h4>
                  </div>
                  <button onClick={() => removeEvent(event.id)} className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-stone-500 font-light leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CompactSchedule: React.FC = () => {
  const { events } = useCalendar();
  return (
    <div className="space-y-4">
      {events.slice(0, 3).map(event => (
        <div key={event.id} className="flex gap-3">
          <div className="w-1.5 rounded-full bg-emerald-100" />
          <div className="flex-1">
            <div className="text-xs font-bold text-stone-800 truncate">{event.title}</div>
            <div className="text-[10px] text-stone-400">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StateProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const colors: Record<string, string> = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500'
  };
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
        <motion.div className={`h-full ${colors[color]}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} />
      </div>
    </div>
  );
};
