export type ActivityCategory = 'Sightseeing' | 'Food' | 'Stay' | 'Transit' | 'Shopping' | 'Other';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
  placeId?: string;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  time: string; // e.g. "09:30"
  location: {
    name: string;
    coordinates?: LocationCoordinates;
  };
  estimatedCost: number;
  actualCost: number;
  notes?: string;
  completed?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string; // "YYYY-MM-DD"
  title?: string;
  activities: Activity[];
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  photoUrl?: string;
  rating?: number;
  coordinates: LocationCoordinates;
  notes?: string;
}

export interface TravelDocument {
  id: string;
  title: string;
  category: 'Ticket' | 'Hotel Voucher' | 'Visa/Passport' | 'Insurance' | 'Note';
  fileUrl?: string;
  fileType?: string;
  confirmationCode?: string;
  notes?: string;
  createdAt: string;
}

export type BudgetStatus = 'UNDER_BUDGET' | 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';

export interface BudgetSummary {
  totalBudget: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  remainingBudget: number;
  estimatedVariance: number; // totalBudget - totalEstimatedCost
  actualVariance: number;    // totalBudget - totalActualCost
  budgetUsagePercent: number; // (actual / total) * 100
  estimatedUsagePercent: number; // (estimated / total) * 100
  status: BudgetStatus;
  categoryBreakdown: Record<ActivityCategory, { estimated: number; actual: number }>;
  dayBreakdown: { dayNumber: number; date: string; estimated: number; actual: number }[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  totalBudget: number;
  coverImage?: string;
  destinations: Destination[];
  itineraryDays: ItineraryDay[];
  documents: TravelDocument[];
  budgetSummary?: BudgetSummary;
  createdAt: string;
  updatedAt: string;
}
