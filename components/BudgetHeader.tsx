'use client';

import React, { useState } from 'react';
import { Trip, BudgetSummary } from '../types/trip';
import { Wallet, AlertTriangle, CheckCircle, Sparkles, FileText, Calendar, MapPin, Edit2, Moon, Sun } from 'lucide-react';

interface BudgetHeaderProps {
  trip: Trip;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onUpdateBudget: (newBudget: number) => void;
  onOpenDocuments: () => void;
  onOpenChat: () => void;
}

export default function BudgetHeader({
  trip,
  darkMode,
  onToggleDarkMode,
  onUpdateBudget,
  onOpenDocuments,
  onOpenChat,
}: BudgetHeaderProps) {
  const summary: BudgetSummary = trip.budgetSummary || {
    totalBudget: trip.totalBudget || 0,
    totalEstimatedCost: 0,
    totalActualCost: 0,
    remainingBudget: trip.totalBudget || 0,
    estimatedVariance: 0,
    actualVariance: 0,
    budgetUsagePercent: 0,
    estimatedUsagePercent: 0,
    status: 'ON_TRACK',
    categoryBreakdown: { Sightseeing: { estimated: 0, actual: 0 }, Food: { estimated: 0, actual: 0 }, Stay: { estimated: 0, actual: 0 }, Transit: { estimated: 0, actual: 0 }, Shopping: { estimated: 0, actual: 0 }, Other: { estimated: 0, actual: 0 } },
    dayBreakdown: [],
  };

  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetValue, setBudgetValue] = useState(trip.totalBudget?.toString() || '0');

  const handleSaveBudget = () => {
    const val = parseFloat(budgetValue);
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(val);
      setIsEditingBudget(false);
    }
  };

  const isOver = summary.status === 'OVER_BUDGET';
  const isNear = summary.status === 'NEAR_LIMIT';

  const progressColor = isOver
    ? 'bg-gradient-to-r from-rose-500 to-red-600'
    : isNear
    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
    : 'bg-gradient-to-r from-emerald-400 to-teal-500';

  const statusBadge = isOver ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/20 backdrop-blur-md">
      <AlertTriangle className="w-3.5 h-3.5" /> Over Budget
    </span>
  ) : isNear ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 backdrop-blur-md">
      <AlertTriangle className="w-3.5 h-3.5" /> Nearing Limit ({summary.budgetUsagePercent}%)
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
      <CheckCircle className="w-3.5 h-3.5" /> On Track
    </span>
  );

  return (
    <header className="sticky top-0 z-30 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Trip Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                {trip.title}
              </span>
              {statusBadge}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {trip.startDate} &rarr; {trip.endDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition shadow-2xs"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={onOpenDocuments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              Documents ({trip.documents?.length || 0})
            </button>
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-xs font-medium text-white transition shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-100" />
              AI Trip Copilot
            </button>
          </div>
        </div>

        {/* The Vibe Check: Glassmorphic Budget Progress Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-700/60 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Wallet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Trip Budget:
              </span>
              {isEditingBudget ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={budgetValue}
                    onChange={(e) => setBudgetValue(e.target.value)}
                    className="w-24 px-2 py-0.5 text-xs border rounded-lg bg-white dark:bg-slate-900 dark:text-white dark:border-slate-600"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="px-2 py-0.5 bg-sky-600 text-white rounded-md text-xs font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="font-bold text-slate-900 dark:text-white flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition"
                  title="Click to edit budget"
                >
                  ${summary.totalBudget.toLocaleString()}
                  <Edit2 className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-600 dark:text-slate-300 font-medium">
              <span>
                Estimated: <strong className="text-slate-800 dark:text-slate-100">${summary.totalEstimatedCost.toLocaleString()}</strong>
              </span>
              <span>
                Actual Spent: <strong className="text-slate-900 dark:text-white">${summary.totalActualCost.toLocaleString()}</strong>
              </span>
              <span>
                Remaining:{' '}
                <strong className={summary.remainingBudget < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}>
                  ${summary.remainingBudget.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-3 rounded-full overflow-hidden flex p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${progressColor}`}
              style={{ width: `${Math.min(100, summary.budgetUsagePercent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            <span>Server-calculated: {summary.budgetUsagePercent}% consumed</span>
            <span>
              {summary.remainingBudget < 0
                ? `Exceeded by $${Math.abs(summary.remainingBudget).toLocaleString()}`
                : `$${summary.remainingBudget.toLocaleString()} safe reserve`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
