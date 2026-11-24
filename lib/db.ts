import { Trip, Activity, Destination, TravelDocument } from '../types/trip';
import { enrichTripWithBudget } from './budgetEngine';
import connectToDatabase from './mongodb';
import TripModel from './models/Trip';

// Initial pre-loaded seed trip for instant rich demo
const initialTrip: Trip = enrichTripWithBudget({
  id: 'trip-japan-2026',
  title: 'Tokyo & Kyoto Cherry Blossom Journey',
  destination: 'Japan (Tokyo, Kyoto, Osaka)',
  startDate: '2026-04-10',
  endDate: '2026-04-16',
  totalBudget: 3500,
  coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  destinations: [
    {
      id: 'dest-1',
      name: 'Senso-ji Temple & Asakusa',
      city: 'Tokyo',
      country: 'Japan',
      photoUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      coordinates: { lat: 35.7148, lng: 139.7967, address: '2 Chome-3-1 Asakusa, Taito City, Tokyo' },
      notes: 'Oldest Buddhist temple in Tokyo. Traditional street food stalls along Nakamise-dori.',
    },
    {
      id: 'dest-2',
      name: 'Fushimi Inari Taisha',
      city: 'Kyoto',
      country: 'Japan',
      photoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      coordinates: { lat: 34.9671, lng: 135.7727, address: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto' },
      notes: 'Thousands of vermilion torii gates winding up sacred Mount Inari. Best visited at dawn.',
    },
    {
      id: 'dest-3',
      name: 'Shibuya Crossing & Sky',
      city: 'Tokyo',
      country: 'Japan',
      photoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      coordinates: { lat: 35.6595, lng: 139.7005, address: '2 Chome-24-12 Shibuya, Tokyo' },
      notes: 'Iconic panoramic 360-degree observation deck over the busiest crossing in the world.',
    },
  ],
  itineraryDays: [
    {
      dayNumber: 1,
      date: '2026-04-10',
      title: 'Arrival & Historic Asakusa',
      activities: [
        {
          id: 'act-101',
          title: 'Narita Skyliner Express to Ueno',
          category: 'Transit',
          time: '14:00',
          location: { name: 'Narita Airport -> Ueno', coordinates: { lat: 35.7653, lng: 140.3856 } },
          estimatedCost: 35,
          actualCost: 35,
          notes: 'High-speed airport transfer train reserved online.',
          completed: true,
        },
        {
          id: 'act-102',
          title: 'Asakusa Senso-ji & Nakamise Street',
          category: 'Sightseeing',
          time: '16:30',
          location: { name: 'Senso-ji Temple', coordinates: { lat: 35.7148, lng: 139.7967 } },
          estimatedCost: 20,
          actualCost: 18,
          notes: 'Taste fresh ningyo-yaki sweets and incense.',
          completed: true,
        },
        {
          id: 'act-103',
          title: 'Traditional Sukiyaki Dinner',
          category: 'Food',
          time: '19:30',
          location: { name: 'Imahan Asakusa', coordinates: { lat: 35.7128, lng: 139.7935 } },
          estimatedCost: 90,
          actualCost: 95,
          notes: 'Wagyu beef sukiyaki set menu.',
          completed: true,
        },
      ],
    },
    {
      dayNumber: 2,
      date: '2026-04-11',
      title: 'Modern Tokyo & Shibuya Highlights',
      activities: [
        {
          id: 'act-201',
          title: 'Meiji Jingu Shrine Morning Walk',
          category: 'Sightseeing',
          time: '09:00',
          location: { name: 'Meiji Jingu', coordinates: { lat: 35.6764, lng: 139.6993 } },
          estimatedCost: 0,
          actualCost: 0,
          notes: 'Peaceful evergreen forest in the heart of Harajuku.',
          completed: false,
        },
        {
          id: 'act-202',
          title: 'Shibuya Sky Observation Deck',
          category: 'Sightseeing',
          time: '17:00',
          location: { name: 'Shibuya Scramble Square', coordinates: { lat: 35.6595, lng: 139.7005 } },
          estimatedCost: 25,
          actualCost: 22,
          notes: 'Sunset slot at 5:00 PM for dusk lighting.',
          completed: false,
        },
        {
          id: 'act-203',
          title: 'Omakase Sushi in Ginza',
          category: 'Food',
          time: '20:00',
          location: { name: 'Ginza Kyubey', coordinates: { lat: 35.6698, lng: 139.7612 } },
          estimatedCost: 150,
          actualCost: 140,
          notes: 'Edo-style chef selection sushi.',
          completed: false,
        },
      ],
    },
    {
      dayNumber: 3,
      date: '2026-04-12',
      title: 'Shinkansen Bullet Train to Kyoto',
      activities: [
        {
          id: 'act-301',
          title: 'Tokaido Shinkansen (Tokyo to Kyoto)',
          category: 'Transit',
          time: '08:30',
          location: { name: 'Tokyo Station -> Kyoto Station', coordinates: { lat: 35.6812, lng: 139.7671 } },
          estimatedCost: 130,
          actualCost: 130,
          notes: 'Mount Fuji visible on right-hand side seats (Seats D/E).',
          completed: false,
        },
        {
          id: 'act-302',
          title: 'Fushimi Inari Torii Gate Hike',
          category: 'Sightseeing',
          time: '14:00',
          location: { name: 'Fushimi Inari', coordinates: { lat: 34.9671, lng: 135.7727 } },
          estimatedCost: 15,
          actualCost: 10,
          notes: 'Hike up to the Yotsutsuji intersection for Kyoto city panorama.',
          completed: false,
        },
      ],
    },
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'Tokyo Keio Plaza Hotel Booking Voucher',
      category: 'Hotel Voucher',
      confirmationCode: 'KP-8829104',
      fileType: 'PDF Document',
      notes: 'Check-in: 15:00. Includes daily buffet breakfast.',
      createdAt: '2026-04-01T10:00:00Z',
    },
    {
      id: 'doc-2',
      title: 'Japan Rail Pass E-Ticket Exchange Order',
      category: 'Ticket',
      confirmationCode: 'JR-EAST-77319',
      fileType: 'E-Ticket',
      notes: 'Exchange at JR Travel Service Center Narita Terminal 1.',
      createdAt: '2026-04-02T12:30:00Z',
    },
  ],
});

// Resilient memory store
let memoryTrips: Trip[] = [initialTrip];

export async function getTrips(): Promise<Trip[]> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const docs = await TripModel.find().lean();
      if (docs && docs.length > 0) {
        return docs.map((doc: any) => enrichTripWithBudget({
          ...doc,
          id: doc._id?.toString() || doc.id,
        }));
      }
    }
  } catch (err) {
    console.warn('MongoDB read error, falling back to in-memory store:', err);
  }
  return memoryTrips;
}

export async function getTripById(id: string): Promise<Trip | null> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const doc: any = await TripModel.findById(id).lean().catch(() => null);
      if (doc) {
        return enrichTripWithBudget({
          ...doc,
          id: doc._id?.toString() || doc.id,
        });
      }
    }
  } catch (err) {
    console.warn('MongoDB read error by id, falling back to in-memory:', err);
  }
  const found = memoryTrips.find((t) => t.id === id);
  return found ? enrichTripWithBudget(found) : null;
}

export async function saveTrip(tripData: Partial<Trip>): Promise<Trip> {
  // Pure server-side computation of budget summary before saving
  const enriched = enrichTripWithBudget(tripData);

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      let savedDoc;
      if (tripData.id && tripData.id.length === 24) {
        savedDoc = await TripModel.findByIdAndUpdate(tripData.id, enriched, {
          new: true,
          upsert: true,
        }).lean();
      } else {
        const doc = new TripModel(enriched);
        savedDoc = await doc.save();
      }
      if (savedDoc) {
        const result = enrichTripWithBudget({
          ...(savedDoc as any),
          id: (savedDoc as any)._id?.toString() || (savedDoc as any).id,
        });
        // Also update memory
        const idx = memoryTrips.findIndex((t) => t.id === result.id || t.id === tripData.id);
        if (idx >= 0) memoryTrips[idx] = result;
        else memoryTrips.unshift(result);
        return result;
      }
    }
  } catch (err) {
    console.warn('MongoDB write error, updating in-memory store:', err);
  }

  // Fallback to memory store
  const existingIdx = memoryTrips.findIndex((t) => t.id === enriched.id);
  if (existingIdx >= 0) {
    memoryTrips[existingIdx] = enriched;
  } else {
    memoryTrips.unshift(enriched);
  }

  return enriched;
}
