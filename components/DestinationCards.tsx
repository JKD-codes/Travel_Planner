'use client';

import React, { useState } from 'react';
import { Destination } from '../types/trip';
import { Star, MapPin, Plus, Navigation } from 'lucide-react';

interface DestinationCardsProps {
  destinations: Destination[];
  onSelectDestination: (destination: Destination) => void;
  onAddDestination: (destination: Destination) => void;
}

export default function DestinationCards({
  destinations,
  onSelectDestination,
  onAddDestination,
}: DestinationCardsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('4.8');
  const [lat, setLat] = useState('35.6586');
  const [lng, setLng] = useState('139.7454');

  const handleSave = () => {
    if (!name.trim()) return;
    onAddDestination({
      id: `dest-${Date.now()}`,
      name: name.trim(),
      city: city.trim() || 'Tokyo',
      country: country.trim() || 'Japan',
      rating: parseFloat(rating) || 4.5,
      photoUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
      coordinates: {
        lat: parseFloat(lat) || 35.6586,
        lng: parseFloat(lng) || 139.7454,
        address: `${city}, ${country}`,
      },
      notes: notes.trim(),
    });
    setName('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Destination Cards
          </h2>
          <p className="text-xs text-slate-500">Key landmarks, ratings & traveler notes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Place
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations?.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest)}
            className="group cursor-pointer bg-white border border-slate-200 hover:border-sky-300 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col"
          >
            <div className="h-36 w-full relative overflow-hidden bg-slate-100">
              <img
                src={dest.photoUrl || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {dest.rating || 4.5}
              </div>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition">
                  {dest.name}
                </h4>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Navigation className="w-3 h-3 text-slate-400" />
                  {dest.city}, {dest.country}
                </div>
                {dest.notes && (
                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
                    {dest.notes}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-medium">
                <span>View on Map</span>
                <span className="text-slate-400 text-[10px]">
                  {dest.coordinates.lat.toFixed(3)}, {dest.coordinates.lng.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-3">Add Destination</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Place Name</label>
                <input
                  type="text"
                  placeholder="e.g. Arashiyama Bamboo Forest"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Kyoto"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Japan"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Add historical context, tips, or operating hours..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg"
              >
                Save Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
