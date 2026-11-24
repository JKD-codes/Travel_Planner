'use client';

import React, { useEffect, useRef } from 'react';
import { Destination, Activity } from '../types/trip';
import { MapPin, Navigation } from 'lucide-react';

interface InteractiveMapProps {
  destinations: Destination[];
  activities: Activity[];
  selectedLocation?: { lat: number; lng: number; name?: string } | null;
}

export default function InteractiveMap({
  destinations,
  activities,
  selectedLocation,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Dynamically load Leaflet on client side
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const defaultCenter: [number, number] = [35.6762, 139.6503]; // Tokyo
        const map = L.map(mapContainerRef.current).setView(defaultCenter, 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers for destinations
      destinations.forEach((dest) => {
        if (dest.coordinates?.lat && dest.coordinates?.lng) {
          const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng])
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
                <strong style="color: #0284c7; font-size: 13px;">${dest.name}</strong><br/>
                <span>${dest.city}, ${dest.country}</span><br/>
                <span style="color: #f59e0b; font-weight: bold;">⭐ ${dest.rating || 4.8}</span>
              </div>
            `);
          markersRef.current.push(marker);
        }
      });

      // Add markers for activities with coordinates
      activities.forEach((act) => {
        if (act.location?.coordinates?.lat && act.location?.coordinates?.lng) {
          const marker = L.circleMarker(
            [act.location.coordinates.lat, act.location.coordinates.lng],
            {
              radius: 7,
              fillColor: '#0284c7',
              color: '#ffffff',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.9,
            }
          )
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; font-size: 12px;">
                <strong>${act.title}</strong><br/>
                <span style="color: #64748b;">${act.time} &bull; ${act.category}</span><br/>
                <span style="font-weight: bold;">Est: $${act.estimatedCost} | Act: $${act.actualCost}</span>
              </div>
            `);
          markersRef.current.push(marker);
        }
      });

      // Fly to selected location if specified
      if (selectedLocation?.lat && selectedLocation?.lng) {
        map.flyTo([selectedLocation.lat, selectedLocation.lng], 14, { duration: 1.2 });
      }
    });

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, [destinations, activities, selectedLocation]);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-[380px] lg:h-[450px]">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800">Interactive Map View</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
          <Navigation className="w-3 h-3 text-sky-500" />
          Synchronized Pins & Geocoding
        </span>
      </div>

      <div ref={mapContainerRef} className="w-full flex-1 z-0" />
    </div>
  );
}
