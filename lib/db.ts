import { Trip, Activity, Destination, TravelDocument } from '../types/trip';
import { enrichTripWithBudget } from './budgetEngine';
import connectToDatabase from './mongodb';
import TripModel from './models/Trip';

// Initial pre-loaded seed trip in English: European Grand Tour (London & Paris)
const initialTrip: Trip = enrichTripWithBudget({
  id: 'trip-europe-2026',
  title: 'London & Paris European Gateway',
  destination: 'United Kingdom & France (London, Paris)',
  startDate: '2026-06-15',
  endDate: '2026-06-21',
  totalBudget: 4200,
  coverImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  destinations: [
    {
      id: 'dest-1',
      name: 'Eiffel Tower & Champ de Mars',
      city: 'Paris',
      country: 'France',
      photoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      coordinates: { lat: 48.8584, lng: 2.2945, address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris' },
      notes: 'Iconic iron tower offering panoramic views of Paris. Pre-booked summit elevator tickets.',
    },
    {
      id: 'dest-2',
      name: 'Tower Bridge & Tower of London',
      city: 'London',
      country: 'United Kingdom',
      photoUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      coordinates: { lat: 51.5055, lng: -0.0754, address: 'Tower Bridge Rd, London SE1 2UP' },
      notes: 'Historic fortress holding the Crown Jewels beside London iconic Victorian suspension bridge.',
    },
    {
      id: 'dest-3',
      name: 'Louvre Museum & Glass Pyramid',
      city: 'Paris',
      country: 'France',
      photoUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      coordinates: { lat: 48.8606, lng: 2.3376, address: 'Rue de Rivoli, 75001 Paris' },
      notes: 'World largest art museum housing the Mona Lisa and Venus de Milo.',
    },
  ],
  itineraryDays: [
    {
      dayNumber: 1,
      date: '2026-06-15',
      title: 'Arrival in London & Thames Promenade',
      activities: [
        {
          id: 'act-101',
          title: 'Heathrow Express to Paddington Station',
          category: 'Transit',
          time: '11:00',
          location: { name: 'Heathrow Terminal 5 -> Paddington', coordinates: { lat: 51.5154, lng: -0.1755 } },
          estimatedCost: 30,
          actualCost: 28,
          notes: 'Express 15-minute train connection into central London.',
          completed: true,
        },
        {
          id: 'act-102',
          title: 'Tower of London Guided Royal Armouries Tour',
          category: 'Sightseeing',
          time: '14:30',
          location: { name: 'Tower of London', coordinates: { lat: 51.5081, lng: -0.0759 } },
          estimatedCost: 40,
          actualCost: 38,
          notes: 'See Crown Jewels and historic medieval fortress.',
          completed: true,
        },
        {
          id: 'act-103',
          title: 'Borough Market British Food Tasting & Dinner',
          category: 'Food',
          time: '18:30',
          location: { name: 'Borough Market, Southwark', coordinates: { lat: 51.5055, lng: -0.0904 } },
          estimatedCost: 55,
          actualCost: 60,
          notes: 'Artisan cheeses, fresh seafood pies, and apple cider.',
          completed: true,
        },
      ],
    },
    {
      dayNumber: 2,
      date: '2026-06-16',
      title: 'Eurostar to Paris & Seine River Cruise',
      activities: [
        {
          id: 'act-201',
          title: 'Eurostar High-Speed Train (London St Pancras to Paris Gare du Nord)',
          category: 'Transit',
          time: '09:00',
          location: { name: 'St Pancras International -> Gare du Nord', coordinates: { lat: 51.5314, lng: -0.1261 } },
          estimatedCost: 120,
          actualCost: 120,
          notes: 'Crossing the English Channel underwater tunnel in 2 hours 15 mins.',
          completed: false,
        },
        {
          id: 'act-202',
          title: 'Louvre Masterpieces & Sculptures Tour',
          category: 'Sightseeing',
          time: '14:30',
          location: { name: 'Musée du Louvre', coordinates: { lat: 48.8606, lng: 2.3376 } },
          estimatedCost: 25,
          actualCost: 25,
          notes: 'Priority entrance reserved via Pyramid gate.',
          completed: false,
        },
        {
          id: 'act-203',
          title: 'Seine River Sunset Dinner Cruise',
          category: 'Food',
          time: '19:45',
          location: { name: 'Bateaux Parisiens, Port de la Bourdonnais', coordinates: { lat: 48.8596, lng: 2.2963 } },
          estimatedCost: 110,
          actualCost: 105,
          notes: '3-course French dining gliding past illuminated Notre-Dame.',
          completed: false,
        },
      ],
    },
    {
      dayNumber: 3,
      date: '2026-06-17',
      title: 'Eiffel Tower Summit & Montmartre',
      activities: [
        {
          id: 'act-301',
          title: 'Eiffel Tower Top-Floor Summit Access',
          category: 'Sightseeing',
          time: '10:00',
          location: { name: 'Eiffel Tower', coordinates: { lat: 48.8584, lng: 2.2945 } },
          estimatedCost: 35,
          actualCost: 35,
          notes: 'Elevator access to Gustave Eiffel private office at summit.',
          completed: false,
        },
        {
          id: 'act-302',
          title: 'Montmartre Artists Square & Sacré-Cœur Basilica',
          category: 'Sightseeing',
          time: '15:00',
          location: { name: 'Sacré-Cœur, Montmartre', coordinates: { lat: 48.8867, lng: 2.3431 } },
          estimatedCost: 0,
          actualCost: 0,
          notes: 'Highest natural vantage point overlooking the rooftops of Paris.',
          completed: false,
        },
      ],
    },
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'London Marriott Hotel Marble Arch Voucher',
      category: 'Hotel Voucher',
      confirmationCode: 'MAR-LON-904128',
      fileType: 'Electronic Voucher / PDF',
      notes: 'Check-in: 15:00. Executive lounge and breakfast included.',
      createdAt: '2026-06-01T10:00:00Z',
    },
    {
      id: 'doc-2',
      title: 'Eurostar Standard Premier E-Ticket (London -> Paris)',
      category: 'Ticket',
      confirmationCode: 'EUR-FR-78192',
      fileType: 'E-Ticket / QR Code',
      notes: 'Coach 3, Seats 41 & 42. Check-in 45 mins before departure at St Pancras.',
      createdAt: '2026-06-02T12:30:00Z',
    },
  ],
});

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
        const idx = memoryTrips.findIndex((t) => t.id === result.id || t.id === tripData.id);
        if (idx >= 0) memoryTrips[idx] = result;
        else memoryTrips.unshift(result);
        return result;
      }
    }
  } catch (err) {
    console.warn('MongoDB write error, updating in-memory store:', err);
  }

  const existingIdx = memoryTrips.findIndex((t) => t.id === enriched.id);
  if (existingIdx >= 0) {
    memoryTrips[existingIdx] = enriched;
  } else {
    memoryTrips.unshift(enriched);
  }

  return enriched;
}
