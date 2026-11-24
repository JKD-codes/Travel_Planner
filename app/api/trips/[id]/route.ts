import { NextResponse } from 'next/server';
import { getTripById, saveTrip } from '@/lib/db';
import { calculateTripBudget } from '@/lib/budgetEngine';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trip = await getTripById(params.id);
    if (!trip) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const existing = await getTripById(params.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    }

    // Merge updates and recalculate budget entirely on the server
    const updated = {
      ...existing,
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveTrip(updated);
    return NextResponse.json({ success: true, trip: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
