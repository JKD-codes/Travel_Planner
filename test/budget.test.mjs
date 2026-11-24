import test from 'node:test';
import assert from 'node:assert';
import { calculateTripBudget } from '../lib/budgetEngine.js';

test('Server-Side Budget Engine Computations', async (t) => {
  await t.test('calculates budget, estimated, and actual accurately', () => {
    const mockDays = [
      {
        dayNumber: 1,
        date: '2026-04-10',
        activities: [
          {
            id: '1',
            title: 'Hotel',
            category: 'Stay',
            time: '12:00',
            location: { name: 'Hotel' },
            estimatedCost: 150,
            actualCost: 140,
          },
          {
            id: '2',
            title: 'Dinner',
            category: 'Food',
            time: '19:00',
            location: { name: 'Restaurant' },
            estimatedCost: 50,
            actualCost: 60,
          },
        ],
      },
    ];

    const result = calculateTripBudget(500, mockDays);

    assert.strictEqual(result.totalBudget, 500);
    assert.strictEqual(result.totalEstimatedCost, 200);
    assert.strictEqual(result.totalActualCost, 200);
    assert.strictEqual(result.remainingBudget, 300);
    assert.strictEqual(result.budgetUsagePercent, 40);
    assert.strictEqual(result.status, 'UNDER_BUDGET');
    assert.strictEqual(result.categoryBreakdown.Stay.actual, 140);
    assert.strictEqual(result.categoryBreakdown.Food.actual, 60);
  });

  await t.test('flags OVER_BUDGET correctly when spending exceeds total budget', () => {
    const mockDays = [
      {
        dayNumber: 1,
        date: '2026-04-10',
        activities: [
          {
            id: '1',
            title: 'Luxury Dinner',
            category: 'Food',
            time: '20:00',
            location: { name: 'Steakhouse' },
            estimatedCost: 300,
            actualCost: 450,
          },
        ],
      },
    ];

    const result = calculateTripBudget(400, mockDays);
    assert.strictEqual(result.status, 'OVER_BUDGET');
    assert.strictEqual(result.remainingBudget, -50);
  });
});
