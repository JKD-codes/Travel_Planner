import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation {
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
  placeId?: string;
}

export interface IActivity {
  id: string;
  title: string;
  category: 'Sightseeing' | 'Food' | 'Stay' | 'Transit' | 'Shopping' | 'Other';
  time: string;
  location: ILocation;
  estimatedCost: number;
  actualCost: number;
  notes?: string;
  completed?: boolean;
}

export interface IItineraryDay {
  dayNumber: number;
  date: string;
  title?: string;
  activities: IActivity[];
}

export interface IDestination {
  id: string;
  name: string;
  city: string;
  country: string;
  photoUrl?: string;
  rating?: number;
  coordinates: {
    lat: number;
    lng: number;
    address?: string;
  };
  notes?: string;
}

export interface ITravelDocument {
  id: string;
  title: string;
  category: 'Ticket' | 'Hotel Voucher' | 'Visa/Passport' | 'Insurance' | 'Note';
  fileUrl?: string;
  fileType?: string;
  confirmationCode?: string;
  notes?: string;
  createdAt: string;
}

export interface ITripDocument extends Document {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  coverImage?: string;
  destinations: IDestination[];
  itineraryDays: IItineraryDay[];
  documents: ITravelDocument[];
  budgetSummary?: {
    totalBudget: number;
    totalEstimatedCost: number;
    totalActualCost: number;
    remainingBudget: number;
    estimatedVariance: number;
    actualVariance: number;
    budgetUsagePercent: number;
    estimatedUsagePercent: number;
    status: 'UNDER_BUDGET' | 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';
  };
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema(
  {
    name: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    placeId: { type: String },
  },
  { _id: false }
);

const ActivitySchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Sightseeing', 'Food', 'Stay', 'Transit', 'Shopping', 'Other'],
      default: 'Sightseeing',
    },
    time: { type: String, default: '10:00' },
    location: { type: LocationSchema, default: () => ({ name: 'General Area' }) },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const ItineraryDaySchema = new Schema(
  {
    dayNumber: { type: Number, required: true },
    date: { type: String, required: true },
    title: { type: String },
    activities: [ActivitySchema],
  },
  { _id: false }
);

const DestinationSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    photoUrl: { type: String },
    rating: { type: Number, default: 4.5 },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String },
    },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const TravelDocumentSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Ticket', 'Hotel Voucher', 'Visa/Passport', 'Insurance', 'Note'],
      default: 'Note',
    },
    fileUrl: { type: String },
    fileType: { type: String },
    confirmationCode: { type: String },
    notes: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const TripSchema = new Schema<ITripDocument>(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalBudget: { type: Number, required: true, default: 0 },
    coverImage: { type: String },
    destinations: { type: [DestinationSchema], default: [] },
    itineraryDays: { type: [ItineraryDaySchema], default: [] },
    documents: { type: [TravelDocumentSchema], default: [] },
    budgetSummary: {
      totalBudget: { type: Number, default: 0 },
      totalEstimatedCost: { type: Number, default: 0 },
      totalActualCost: { type: Number, default: 0 },
      remainingBudget: { type: Number, default: 0 },
      estimatedVariance: { type: Number, default: 0 },
      actualVariance: { type: Number, default: 0 },
      budgetUsagePercent: { type: Number, default: 0 },
      estimatedUsagePercent: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['UNDER_BUDGET', 'ON_TRACK', 'NEAR_LIMIT', 'OVER_BUDGET'],
        default: 'ON_TRACK',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model in Next.js hot-reload
export const TripModel: Model<ITripDocument> =
  mongoose.models.Trip || mongoose.model<ITripDocument>('Trip', TripSchema);

export default TripModel;
