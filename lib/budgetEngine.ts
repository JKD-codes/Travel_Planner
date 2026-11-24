import { Trip, BudgetSummary, BudgetStatus, ActivityCategory } from '../types/trip';

/**
 * Pure server-side budget computation engine.
 * Calculates Budget vs. Actual, remaining balances, percentage usage,
 * category spending distributions, and budget health alerts.
 */
export function calculateTripBudget(
  totalBudget: number,
  itineraryDays: Trip['itineraryDays']
): BudgetSummary {
  const safeTotalBudget = Number(totalBudget) > 0 ? Number(totalBudget) : 0;
  let totalEstimatedCost = 0;
  let totalActualCost = 0;

  const defaultCategories: ActivityCategory[] = [
    'Sightseeing',
    'Food',
    'Stay',
    'Transit',
    'Shopping',
    'Other',
  ];

  const categoryBreakdown: Record<ActivityCategory, { estimated: number; actual: number }> = {
    Sightseeing: { estimated: 0, actual: 0 },
    Food: { estimated: 0, actual: 0 },
    Stay: { estimated: 0, actual: 0 },
    Transit: { estimated: 0, actual: 0 },
    Shopping: { estimated: 0, actual: 0 },
    Other: { estimated: 0, actual: 0 },
  };

  const dayBreakdown: { dayNumber: number; date: string; estimated: number; actual: number }[] = [];

  if (Array.isArray(itineraryDays)) {
    for (const day of itineraryDays) {
      let dayEstimated = 0;
      let dayActual = 0;

      if (Array.isArray(day.activities)) {
        for (const act of day.activities) {
          const est = Math.max(0, Number(act.estimatedCost) || 0);
          const actVal = Math.max(0, Number(act.actualCost) || 0);

          dayEstimated += est;
          dayActual += actVal;

          totalEstimatedCost += est;
          totalActualCost += actVal;

          const cat: ActivityCategory = defaultCategories.includes(act.category)
            ? act.category
            : 'Other';

          categoryBreakdown[cat].estimated += est;
          categoryBreakdown[cat].actual += actVal;
        }
      }

      dayBreakdown.push({
        dayNumber: day.dayNumber,
        date: day.date || '',
        estimated: Number(dayEstimated.toFixed(2)),
        actual: Number(dayActual.toFixed(2)),
      });
    }
  }

  // Rounded values
  totalEstimatedCost = Number(totalEstimatedCost.toFixed(2));
  totalActualCost = Number(totalActualCost.toFixed(2));

  const remainingBudget = Number((safeTotalBudget - totalActualCost).toFixed(2));
  const estimatedVariance = Number((safeTotalBudget - totalEstimatedCost).toFixed(2));
  const actualVariance = Number((safeTotalBudget - totalActualCost).toFixed(2));

  const budgetUsagePercent =
    safeTotalBudget > 0
      ? Number(Math.min(1000, (totalActualCost / safeTotalBudget) * 100).toFixed(1))
      : 0;

  const estimatedUsagePercent =
    safeTotalBudget > 0
      ? Number(Math.min(1000, (totalEstimatedCost / safeTotalBudget) * 100).toFixed(1))
      : 0;

  // Determine budget status
  let status: BudgetStatus = 'ON_TRACK';
  if (totalActualCost > safeTotalBudget || totalEstimatedCost > safeTotalBudget) {
    status = 'OVER_BUDGET';
  } else if (budgetUsagePercent >= 85 || estimatedUsagePercent >= 85) {
    status = 'NEAR_LIMIT';
  } else if (budgetUsagePercent < 50 && totalActualCost > 0) {
    status = 'UNDER_BUDGET';
  }

  return {
    totalBudget: safeTotalBudget,
    totalEstimatedCost,
    totalActualCost,
    remainingBudget,
    estimatedVariance,
    actualVariance,
    budgetUsagePercent,
    estimatedUsagePercent,
    status,
    categoryBreakdown,
    dayBreakdown,
  };
}

/**
 * Enrich a trip document with server-computed budget metrics
 */
export function enrichTripWithBudget(trip: Partial<Trip>): Trip {
  const budgetSummary = calculateTripBudget(
    trip.totalBudget || 0,
    trip.itineraryDays || []
  );

  return {
    id: trip.id || `trip-${Date.now()}`,
    title: trip.title || 'Untitled Trip',
    destination: trip.destination || 'Unspecified',
    startDate: trip.startDate || new Date().toISOString().split('T')[0],
    endDate: trip.endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    totalBudget: trip.totalBudget || 0,
    coverImage: trip.coverImage,
    destinations: trip.destinations || [],
    itineraryDays: trip.itineraryDays || [],
    documents: trip.documents || [],
    budgetSummary,
    createdAt: trip.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
