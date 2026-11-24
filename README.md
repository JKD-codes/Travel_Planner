# 🌍 Travel Planner — Interactive Itinerary, Map & Budget Tracker

A modern, production-grade interactive trip-planning application built with **Next.js**, **React**, **Tailwind CSS**, and **MongoDB (Mongoose)**. Designed with a clean architecture where **100% of business logic, budget calculations, validations, and computations are executed strictly on the server side**.

---

## 🚀 Key Features

### 1. 🗺️ Interactive Geospatial Map
- Embedded map view integrating geolocation pins for trip destinations and scheduled activities.
- Fully synchronized: clicking any activity or destination card centers the map on the coordinates with rich popups.
- Fallback-resilient: supports Google Maps / Places API with Leaflet/OpenStreetMap fallback.

### 2. 📅 Vertical Chronological Itinerary Timeline
- Day-by-day chronological breakdown of travel activities.
- Each activity includes: Title, Time slot, Category (*Sightseeing*, *Food*, *Stay*, *Transit*, *Shopping*), Location, Estimated Cost, and Actual Cost.
- Real-time updates trigger immediate server-side budget recalculations.

### 3. 💳 "The Vibe Check" — Server-Side Budget vs. Actual Tracker
- **Strict Server-Side Computation**: All financial metrics, variances, percentages, and health statuses are calculated on the backend (`lib/budgetEngine.ts`).
- **Dynamic Visual Progress Bar**: Color-coded top progress bar:
  - 🟢 **On Track** (< 85% budget utilization)
  - 🟡 **Nearing Limit** (85% – 99% budget utilization)
  - 🔴 **Over Budget** (> 100% budget utilization or estimated cost exceeds budget)
- Displays Total Allocated Budget, Total Estimated Cost, Total Actual Cost, and Remaining Balance.

### 4. 🗂️ Destination Cards & Travel Documents
- **Destination Cards**: Displays place cards with high-resolution imagery, star ratings, geographic coordinates, and custom traveler notes.
- **Travel Documents Repository**: Stores flight/train e-tickets, hotel booking vouchers, confirmation references, and visa notes.

### 5. 🤖 Two AI Chatbot Features
- **Feature 1: AI Trip Copilot (Smart Itinerary Generator)**: Generates structured activity recommendations tailored to your destination and schedule. Users can add suggested activities to their itinerary timeline with **one click**!
- **Feature 2: Conversational Budget & Travel Advisor**: Real-time advisor that answers travel questions, audits budget health, flags overspending, and queries stored booking confirmation references.

---

## 🏗️ Architecture & Server-Side Enforcement

```
Travel_Planner/
├── app/
│   ├── api/
│   │   ├── trips/               # GET all trips, POST create trip (server budget calculation)
│   │   │   └── [id]/route.ts    # GET trip by id, PUT update trip & recalculate budget
│   │   ├── places/route.ts      # Google Places API integration & geocoding
│   │   └── chat/route.ts        # AI Copilot & Budget Advisor Chatbot backend
│   ├── globals.css              # Tailwind styling & custom scrollbars
│   ├── layout.tsx               # Root HTML metadata & Leaflet styles
│   └── page.tsx                 # Main Planner Dashboard
├── components/
│   ├── BudgetHeader.tsx         # "The Vibe Check" Progress Bar & key stats
│   ├── InteractiveMap.tsx       # Leaflet & Google Map with synchronized pins
│   ├── ItineraryTimeline.tsx    # Chronological daily timeline & cost inputs
│   ├── DestinationCards.tsx     # Destination cards with ratings & notes
│   ├── TravelDocumentsModal.tsx # Travel documents & voucher repository
│   └── AIChatModal.tsx          # AI Copilot & Budget Advisor UI
├── lib/
│   ├── budgetEngine.ts          # Pure server-side budget computation logic
│   ├── db.ts                    # Resilient database layer (MongoDB + in-memory store)
│   ├── mongodb.ts               # Mongoose database connection client
│   └── models/Trip.ts           # Mongoose Schema with nested arrays & validations
├── test/
│   └── budget.test.mjs          # Unit tests verifying server-side calculations
├── types/
│   └── trip.ts                  # TypeScript interfaces for Trip, Activity, Budget
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
```bash
git clone https://github.com/JKD-codes/Travel_Planner.git
cd Travel_Planner
npm install
```

### 2. Environment Setup (Optional)
Copy `.env.example` to `.env`:
```env
# Optional: MongoDB URI (defaults to resilient in-memory store if unset)
MONGODB_URI=mongodb://localhost:27017/travel_planner

# Optional: Google Maps & Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

# Optional: Gemini API Key for Chatbot
GEMINI_API_KEY=your_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Run Server-Side Unit Tests
```bash
npm test
```
Verifies server calculations for budget vs. actual costs and over-budget triggers.
