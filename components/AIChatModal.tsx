'use client';

import React, { useState } from 'react';
import { Trip, Activity } from '../types/trip';
import { Sparkles, Send, X, PlusCircle, CheckCircle, Bot, User, HelpCircle } from 'lucide-react';

interface AIChatModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onAddActivityFromAI: (dayNumber: number, activity: Activity) => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  type?: 'text' | 'copilot_suggestions';
  suggestions?: Activity[];
}

export default function AIChatModal({
  trip,
  isOpen,
  onClose,
  onAddActivityFromAI,
}: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `👋 Hi! I am your **AI Travel Copilot & Budget Advisor**.\n\nI can:\n✨ **Suggest tailored activities** for any day and insert them into your itinerary.\n💰 **Audit your budget vs. actual costs** and alert you before you overspend.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetDay, setTargetDay] = useState<number>(1);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSend = async (messageText: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          tripContext: trip,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.reply,
            type: data.type,
            suggestions: data.suggestions,
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue connecting to the AI engine. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = (act: Activity) => {
    onAddActivityFromAI(targetDay, act);
    setAddedIds((prev) => ({ ...prev, [act.id]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-100 flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Travel Copilot & Advisor</h3>
              <p className="text-[11px] text-slate-500">
                Itinerary Generator &bull; Server-Side Budget Auditor
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto scrollbar-none border-b border-slate-50">
          <button
            onClick={() => handleSend('Suggest 3 afternoon activities with costs')}
            className="px-2.5 py-1 text-[11px] bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-full font-medium whitespace-nowrap"
          >
            ✨ Suggest Activities
          </button>
          <button
            onClick={() => handleSend('Audit my budget vs actual spending')}
            className="px-2.5 py-1 text-[11px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full font-medium whitespace-nowrap"
          >
            💰 Budget Audit
          </button>
          <button
            onClick={() => handleSend('What travel documents do I have stored?')}
            className="px-2.5 py-1 text-[11px] bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full font-medium whitespace-nowrap"
          >
            📄 Check Documents
          </button>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Structured Activity Cards from AI */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Add suggested items to:</span>
                      <select
                        value={targetDay}
                        onChange={(e) => setTargetDay(Number(e.target.value))}
                        className="bg-white border rounded px-1.5 py-0.5 text-[11px] text-slate-700 font-semibold"
                      >
                        {trip.itineraryDays.map((d) => (
                          <option key={d.dayNumber} value={d.dayNumber}>
                            Day {d.dayNumber} ({d.date})
                          </option>
                        ))}
                      </select>
                    </div>

                    {m.suggestions.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{act.title}</div>
                          <div className="text-[10px] text-slate-500">
                            {act.time} &bull; {act.category} &bull; Est: ${act.estimatedCost}
                          </div>
                        </div>

                        <button
                          disabled={addedIds[act.id]}
                          onClick={() => handleAddSuggestion(act)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                            addedIds[act.id]
                              ? 'bg-emerald-100 text-emerald-700 cursor-default'
                              : 'bg-sky-600 hover:bg-sky-700 text-white'
                          }`}
                        >
                          {addedIds[act.id] ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> Added
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3 h-3" /> Add to Timeline
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs text-slate-400">
              <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span>AI is thinking & formulating recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI Copilot to suggest activities or analyze budget..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
