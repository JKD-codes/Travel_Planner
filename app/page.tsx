'use client';

import React, { useState, useEffect } from 'react';
import { Trip, Activity, Destination, TravelDocument } from '@/types/trip';
import BudgetHeader from '@/components/BudgetHeader';
import ItineraryTimeline from '@/components/ItineraryTimeline';
import DestinationCards from '@/components/DestinationCards';
import InteractiveMap from '@/components/InteractiveMap';
import TravelDocumentsModal from '@/components/TravelDocumentsModal';
import AIChatModal from '@/components/AIChatModal';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);

  // Fetch initial trip data from server (with server-computed budget)
  useEffect(() => {
    async function loadTrip() {
      try {
        const res = await fetch('/api/trips');
        const data = await res.json();
        if (data.success && data.trips?.length > 0) {
          setTrip(data.trips[0]);
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, []);

  // Save changes to server and receive recalculated budget
  const updateTripOnServer = async (updatedTrip: Trip) => {
    setTrip(updatedTrip); // Optimistic UI update
    try {
      const res = await fetch(`/api/trips/${updatedTrip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrip),
      });
      const data = await res.json();
      if (data.success && data.trip) {
        setTrip(data.trip); // Synchronize with exact server-side calculations
      }
    } catch (err) {
      console.error('Failed to update trip on server:', err);
    }
  };

  // Update total budget
  const handleUpdateBudget = (newBudget: number) => {
    if (!trip) return;
    const updated = { ...trip, totalBudget: newBudget };
    updateTripOnServer(updated);
  };

  // Update activity cost (Server automatically recalculates progress bar)
  const handleUpdateActivityCost = (
    dayNumber: number,
    activityId: string,
    estimatedCost: number,
    actualCost: number
  ) => {
    if (!trip) return;
    const updatedDays = trip.itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.map((act) => {
          if (act.id !== activityId) return act;
          return { ...act, estimatedCost, actualCost };
        }),
      };
    });
    updateTripOnServer({ ...trip, itineraryDays: updatedDays });
  };

  // Add new activity
  const handleAddActivity = (dayNumber: number, newAct: Partial<Activity>) => {
    if (!trip) return;
    const activity: Activity = {
      id: `act-${Date.now()}`,
      title: newAct.title || 'New Activity',
      category: newAct.category || 'Sightseeing',
      time: newAct.time || '10:00',
      location: newAct.location || { name: 'General Location' },
      estimatedCost: newAct.estimatedCost || 0,
      actualCost: newAct.actualCost || 0,
      notes: newAct.notes || '',
      completed: false,
    };

    const updatedDays = trip.itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: [...day.activities, activity],
      };
    });
    updateTripOnServer({ ...trip, itineraryDays: updatedDays });
  };

  // Delete activity
  const handleDeleteActivity = (dayNumber: number, activityId: string) => {
    if (!trip) return;
    const updatedDays = trip.itineraryDays.map((day) => {
      if (day.dayNumber !== dayNumber) return day;
      return {
        ...day,
        activities: day.activities.filter((act) => act.id !== activityId),
      };
    });
    updateTripOnServer({ ...trip, itineraryDays: updatedDays });
  };

  // Add destination
  const handleAddDestination = (dest: Destination) => {
    if (!trip) return;
    const updated = {
      ...trip,
      destinations: [...(trip.destinations || []), dest],
    };
    updateTripOnServer(updated);
  };

  // Add travel document
  const handleAddDocument = (doc: TravelDocument) => {
    if (!trip) return;
    const updated = {
      ...trip,
      documents: [...(trip.documents || []), doc],
    };
    updateTripOnServer(updated);
  };

  // Add suggested activity from AI Copilot directly to timeline
  const handleAddActivityFromAI = (dayNumber: number, act: Activity) => {
    handleAddActivity(dayNumber, act);
  };

  // Select location from timeline to center on map
  const handleSelectLocation = (
    coordinates?: { lat: number; lng: number },
    name?: string
  ) => {
    if (coordinates?.lat && coordinates?.lng) {
      setSelectedLocation({ lat: coordinates.lat, lng: coordinates.lng, name });
    }
  };

  if (loading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading Travel Planner...</p>
        </div>
      </div>
    );
  }

  // All activities flattened for map pins
  const allActivities = trip.itineraryDays.flatMap((d) => d.activities || []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* 1. The Vibe Check - Top Budget Tracker Header */}
      <BudgetHeader
        trip={trip}
        onUpdateBudget={handleUpdateBudget}
        onOpenDocuments={() => setIsDocumentsOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Interactive Map & Destination Cards */}
          <div className="lg:col-span-5 space-y-6">
            <InteractiveMap
              destinations={trip.destinations}
              activities={allActivities}
              selectedLocation={selectedLocation}
            />
            <DestinationCards
              destinations={trip.destinations}
              onSelectDestination={(dest) =>
                handleSelectLocation(dest.coordinates, dest.name)
              }
              onAddDestination={handleAddDestination}
            />
          </div>

          {/* Right Column (7 Cols): Vertical Chronological Itinerary Timeline */}
          <div className="lg:col-span-7">
            <ItineraryTimeline
              trip={trip}
              onUpdateActivityCost={handleUpdateActivityCost}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
              onSelectLocation={handleSelectLocation}
            />
          </div>
        </div>
      </main>

      {/* Floating AI Trip Copilot Trigger Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group border border-sky-400"
      >
        <Sparkles className="w-4 h-4 text-sky-200 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold">AI Copilot</span>
      </button>

      {/* Modals */}
      <TravelDocumentsModal
        documents={trip.documents || []}
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
        onAddDocument={handleAddDocument}
      />

      <AIChatModal
        trip={trip}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onAddActivityFromAI={handleAddActivityFromAI}
      />
    </div>
  );
}
