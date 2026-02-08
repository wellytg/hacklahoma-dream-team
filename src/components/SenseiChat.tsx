
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Calendar, Check, X, Loader2, Info, Clock, Layers } from 'lucide-react';
import { ChatMessage, ResolvedStateModel, CalendarEvent } from '../types';
import { getSenseiResponse } from '../lib/gemini';
import { useCalendar } from '../context/CalendarContext';
import { useSession } from '../context/AuthContext';

interface SenseiChatProps {
  profile: ResolvedStateModel;
}

export const SenseiChat: React.FC<SenseiChatProps> = ({ profile }) => {
  const { addEvent, addPath } = useCalendar();
  const { session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Greetings, ${session?.user.name.split(' ')[0]}. I've tuned my support for your ${profile.mode} profile. Shall we design a path for today? [Design a path] [Just a focus block]`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const extractChips = (text: string) => {
    const regex = /\[(.*?)\]/g;
    const chips: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      chips.push(match[1]);
    }
    return chips;
  };

  const cleanText = (text: string) => text.replace(/\[(.*?)\]/g, '').trim();

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await getSenseiResponse(chatHistory, profile);
      
      const parts = response.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find(p => p.text);
      const callPart = response.functionCalls?.[0];

      if (callPart) {
        if (callPart.name === 'schedule_event') {
          const assistantMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: "Proposing a single event to anchor your momentum.",
            timestamp: Date.now(),
            type: 'event_proposal',
            eventData: callPart.args as any
          };
          setMessages(prev => [...prev, assistantMsg]);
        } else if (callPart.name === 'design_path') {
          const args = callPart.args as any;
          const assistantMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `I've designed the "${args.pathName}" path to help you navigate your current friction. [Looks good] [Adjust it]`,
            timestamp: Date.now(),
            type: 'path_proposal',
            pathData: args.steps
          };
          setMessages(prev => [...prev, assistantMsg]);
        }
      } else if (textPart) {
        const assistantMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: textPart.text,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: "I lost my train of thought. Let's try again. [Retry]",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-stone-800 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-stone-900 text-white rounded-tr-none' 
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                  }`}>
                    {msg.type === 'event_proposal' ? (
                      <EventProposalCard data={msg.eventData!} onConfirm={(d) => { addEvent(d); handleSend("Confirmed."); }} />
                    ) : msg.type === 'path_proposal' ? (
                      <PathProposalCard steps={msg.pathData!} onConfirm={(steps) => { addPath(steps); handleSend("Path looks great!"); }} />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{cleanText(msg.content)}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>

      <div className="p-4 md:p-8 border-t border-stone-100 bg-white">
        <div className="flex flex-wrap gap-2 mb-4">
          {extractChips(messages[messages.length - 1]?.content || "").map((chip, idx) => (
            <button key={idx} onClick={() => handleSend(chip)} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all shadow-sm">
              {chip}
            </button>
          ))}
        </div>
        <div className="relative group max-w-2xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend(input))}
            placeholder="What's our goal for this session?"
            className="w-full p-5 pr-14 bg-white border border-stone-200 rounded-[2rem] shadow-xl shadow-stone-200/50 focus:outline-none focus:border-emerald-500 transition-all resize-none max-h-32 text-sm"
            rows={1}
          />
          <button onClick={() => handleSend(input)} disabled={!input.trim() || isTyping} className="absolute right-3 top-3 w-10 h-10 bg-stone-900 text-white rounded-2xl flex items-center justify-center hover:bg-stone-800 disabled:opacity-50 transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EventProposalCard: React.FC<{ data: any; onConfirm: (d: any) => void }> = ({ data, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="w-64 space-y-3">
      <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase">
        <Calendar size={14} /> <span>Single Event</span>
      </div>
      <h4 className="font-bold text-stone-900">{data.title}</h4>
      <p className="text-xs text-stone-500 italic">"{data.description}"</p>
      {!confirmed ? (
        <button onClick={() => { setConfirmed(true); onConfirm(data); }} className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold">Add to Calendar</button>
      ) : (
        <div className="py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2"><Check size={14} /> Added</div>
      )}
    </div>
  );
};

const PathProposalCard: React.FC<{ steps: any[]; onConfirm: (steps: any[]) => void }> = ({ steps, onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="w-72 space-y-4">
      <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase">
        <Layers size={14} /> <span>Proposed Path</span>
      </div>
      <div className="space-y-3 border-l-2 border-stone-100 pl-4">
        {steps.map((step, i) => (
          <div key={i} className="relative">
             <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-stone-200" />
             <div className="text-xs font-bold text-stone-900">{step.title}</div>
             <div className="text-[10px] text-stone-500">{new Date(step.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {step.duration}m</div>
          </div>
        ))}
      </div>
      {!confirmed ? (
        <button onClick={() => { setConfirmed(true); onConfirm(steps); }} className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-bold shadow-lg">Commit to Path</button>
      ) : (
        <div className="py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-inner"><Check size={14} /> Path Committed</div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-3">
      <div className="flex gap-1">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>
    </div>
  </div>
);
