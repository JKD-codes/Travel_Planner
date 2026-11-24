import { NextResponse } from 'next/server';
import { getTrips, saveTrip } from '@/lib/db';
import { enrichTripWithBudget } from '@/lib/budgetEngine';

export async function GET() {
  try {
    const trips = await getTrips();
    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Server-side validation and budget calculation
    if (!body.title || !body.destination) {
      return NextResponse.json(
        { success: false, error: 'Title and destination are required' },
        { status: 400 }
      );
    }

    const saved = await saveTrip(body);
    return NextResponse.json({ success: true, trip: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
