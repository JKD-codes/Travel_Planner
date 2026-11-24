'use client';

import React, { useState } from 'react';
import { Trip, Activity, ActivityCategory } from '../types/trip';
import { Clock, DollarSign, MapPin, Plus, CheckCircle2, Circle, Trash2, CalendarDays } from 'lucide-react';

interface ItineraryTimelineProps {
  trip: Trip;
  onUpdateActivityCost: (dayNumber: number, activityId: string, estimatedCost: number, actualCost: number) => void;
  onAddActivity: (dayNumber: number, activity: Partial<Activity>) => void;
  onDeleteActivity: (dayNumber: number, activityId: string) => void;
  onSelectLocation: (coordinates?: { lat: number; lng: number }, name?: string) => void;
}

export default function ItineraryTimeline({
  trip,
  onUpdateActivityCost,
  onAddActivity,
  onDeleteActivity,
  onSelectLocation,
}: ItineraryTimelineProps) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [newActivityDay, setNewActivityDay] = useState<number | null>(null);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('Sightseeing');
  const [newTime, setNewTime] = useState('12:00');
  const [newLocation, setNewLocation] = useState('');
  const [newEstimatedCost, setNewEstimatedCost] = useState('0');

  const handleCreateActivity = (dayNumber: number) => {
    if (!newTitle.trim()) return;
    onAddActivity(dayNumber, {
      title: newTitle.trim(),
      category: newCategory,
      time: newTime,
      location: { name: newLocation || 'Designated Venue' },
      estimatedCost: parseFloat(newEstimatedCost) || 0,
      actualCost: 0,
      notes: '',
    });
    setNewTitle('');
    setNewLocation('');
    setNewEstimatedCost('0');
    setNewActivityDay(null);
  };

  const getCategoryBadgeClass = (category: ActivityCategory) => {
    switch (category) {
      case 'Food':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Sightseeing':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Stay':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Transit':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shopping':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-sky-600" />
          Itinerary Timeline
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          Chronological daily breakdown
        </span>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 mb-6 scrollbar-none">
        {trip.itineraryDays?.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeDay === day.dayNumber
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Day {day.dayNumber} <span className="opacity-75 font-normal">({day.activities?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Vertical Timeline */}
      <div className="space-y-6">
        {trip.itineraryDays
          ?.filter((d) => d.dayNumber === activeDay)
          .map((day) => (
            <div key={day.dayNumber} className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  {day.title || `Day ${day.dayNumber}`} &bull;{' '}
                  <span className="text-slate-500 font-normal">{day.date}</span>
                </h3>
                <button
                  onClick={() => setNewActivityDay(newActivityDay === day.dayNumber ? null : day.dayNumber)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50 rounded-md transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Activity
                </button>
              </div>

              {/* Add Activity Form */}
              {newActivityDay === day.dayNumber && (
                <div className="mb-4 p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl space-y-2.5 animate-fadeIn">
                  <div className="text-xs font-semibold text-sky-900">New Activity for Day {day.dayNumber}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Activity Title (e.g., TeamLab Planets)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Location Name"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="Sightseeing">Sightseeing</option>
                      <option value="Food">Food</option>
                      <option value="Stay">Stay</option>
                      <option value="Transit">Transit</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Estimated Cost ($)"
                      value={newEstimatedCost}
                      onChange={(e) => setNewEstimatedCost(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setNewActivityDay(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCreateActivity(day.dayNumber)}
                      className="px-3 py-1 text-xs bg-sky-600 text-white font-medium rounded-md hover:bg-sky-700"
                    >
                      Save Activity
                    </button>
                  </div>
                </div>
              )}

              {/* Chronological List */}
              <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
                {day.activities?.length === 0 ? (
                  <div className="text-xs text-slate-400 py-4 italic">No activities planned for this day yet.</div>
                ) : (
                  day.activities?.map((activity) => (
                    <div
                      key={activity.id}
                      className="relative bg-white border border-slate-200 rounded-xl p-3.5 hover:shadow-xs transition group"
                    >
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 ring-4 ring-slate-50" />

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{activity.title}</span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                                activity.category
                              )}`}
                            >
                              {activity.category}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {activity.time}
                            </span>
                            <button
                              onClick={() =>
                                onSelectLocation(activity.location?.coordinates, activity.location?.name)
                              }
                              className="flex items-center gap-1 text-sky-600 hover:underline cursor-pointer"
                            >
                              <MapPin className="w-3 h-3" />
                              {activity.location?.name}
                            </button>
                          </div>

                          {activity.notes && (
                            <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                              {activity.notes}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => onDeleteActivity(day.dayNumber, activity.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition p-1"
                          title="Delete activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Interactive Cost Inputs (Triggers Server-Side Budget Recalculation) */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 text-[11px]">Est:</span>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                              <span className="text-slate-400 text-[10px]">$</span>
                              <input
                                type="number"
                                value={activity.estimatedCost}
                                onChange={(e) =>
                                  onUpdateActivityCost(
                                    day.dayNumber,
                                    activity.id,
                                    parseFloat(e.target.value) || 0,
                                    activity.actualCost
                                  )
                                }
                                className="w-12 bg-transparent text-xs text-slate-700 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 text-[11px]">Actual:</span>
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                              <span className="text-slate-400 text-[10px]">$</span>
                              <input
                                type="number"
                                value={activity.actualCost}
                                onChange={(e) =>
                                  onUpdateActivityCost(
                                    day.dayNumber,
                                    activity.id,
                                    activity.estimatedCost,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-12 bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {activity.actualCost > 0 && (
                          <span
                            className={`text-[10px] font-semibold ${
                              activity.actualCost > activity.estimatedCost ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {activity.actualCost > activity.estimatedCost
                              ? `+$${activity.actualCost - activity.estimatedCost} over est.`
                              : `-$${activity.estimatedCost - activity.actualCost} under est.`}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
