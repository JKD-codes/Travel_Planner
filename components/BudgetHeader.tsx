'use client';

import React, { useState } from 'react';
import { Trip, BudgetSummary } from '../types/trip';
import { Wallet, TrendingUp, AlertTriangle, CheckCircle, Sparkles, FileText, Calendar, MapPin, Edit2 } from 'lucide-react';

interface BudgetHeaderProps {
  trip: Trip;
  onUpdateBudget: (newBudget: number) => void;
  onOpenDocuments: () => void;
  onOpenChat: () => void;
}

export default function BudgetHeader({
  trip,
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
    ? 'bg-rose-500'
    : isNear
    ? 'bg-amber-500'
    : 'bg-emerald-500';

  const statusBadge = isOver ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
      <AlertTriangle className="w-3.5 h-3.5" /> Over Budget
    </span>
  ) : isNear ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      <AlertTriangle className="w-3.5 h-3.5" /> Nearing Limit ({summary.budgetUsagePercent}%)
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
      <CheckCircle className="w-3.5 h-3.5" /> On Track
    </span>
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Trip Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">{trip.title}</span>
              {statusBadge}
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                {trip.destination}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {trip.startDate} &rarr; {trip.endDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDocuments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Documents ({trip.documents?.length || 0})
            </button>
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-xs font-medium text-white transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              AI Trip Copilot
            </button>
          </div>
        </div>

        {/* The Vibe Check: Budget Progress Bar & Key Numbers */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Wallet className="w-4 h-4 text-sky-600" />
                Trip Budget:
              </span>
              {isEditingBudget ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={budgetValue}
                    onChange={(e) => setBudgetValue(e.target.value)}
                    className="w-24 px-2 py-0.5 text-xs border rounded bg-white"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="px-2 py-0.5 bg-sky-600 text-white rounded text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="font-bold text-slate-900 flex items-center gap-1 hover:text-sky-600 transition"
                  title="Click to edit budget"
                >
                  ${summary.totalBudget.toLocaleString()}
                  <Edit2 className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span>
                Estimated: <strong className="text-slate-800">${summary.totalEstimatedCost.toLocaleString()}</strong>
              </span>
              <span>
                Actual Spent: <strong className="text-slate-900">${summary.totalActualCost.toLocaleString()}</strong>
              </span>
              <span>
                Remaining:{' '}
                <strong className={summary.remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                  ${summary.remainingBudget.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(100, summary.budgetUsagePercent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
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
