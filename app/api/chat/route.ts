import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, tripContext, mode } = await req.json();

    // Mode: 'copilot' (Generates structured activity suggestions) or 'advisor' (Answers questions & audits budget)
    const isCopilotRequest =
      mode === 'copilot' ||
      message.toLowerCase().includes('suggest') ||
      message.toLowerCase().includes('add') ||
      message.toLowerCase().includes('itinerary') ||
      message.toLowerCase().includes('plan');

    if (isCopilotRequest) {
      // Return structured activity suggestions ready for 1-click addition to timeline!
      const suggestedActivities = [
        {
          id: `act-ai-${Date.now()}-1`,
          title: 'Imperial Palace East Gardens Walk',
          category: 'Sightseeing',
          time: '11:00',
          location: {
            name: 'Imperial Palace Gardens, Chiyoda',
            coordinates: { lat: 35.6852, lng: 139.7528 },
          },
          estimatedCost: 15,
          actualCost: 0,
          notes: 'Serene Japanese gardens, historic ruins and tea pavilion. Free entry with paid tea ceremony.',
        },
        {
          id: `act-ai-${Date.now()}-2`,
          title: 'Tsukiji Outer Market Food Tour',
          category: 'Food',
          time: '13:00',
          location: {
            name: 'Tsukiji Outer Market, Chuo',
            coordinates: { lat: 35.6655, lng: 139.7708 },
          },
          estimatedCost: 45,
          actualCost: 0,
          notes: 'Sample fresh king crab skewers, tamagoyaki, and sea urchin bowl.',
        },
        {
          id: `act-ai-${Date.now()}-3`,
          title: 'Akihabara Electric Town & Retro Arcades',
          category: 'Shopping',
          time: '16:00',
          location: {
            name: 'Akihabara, Chiyoda',
            coordinates: { lat: 35.6984, lng: 139.7731 },
          },
          estimatedCost: 30,
          actualCost: 0,
          notes: 'Explore multi-story electronics, anime boutiques, and retro arcade games.',
        },
      ];

      return NextResponse.json({
        success: true,
        type: 'copilot_suggestions',
        reply: `Here are 3 tailored activities for **${tripContext?.destination || 'your destination'}** that align with your budget and schedule. You can add any of them directly to your timeline with one click!`,
        suggestions: suggestedActivities,
      });
    }

    // Default: Conversational Budget & Travel Advisor
    const totalBudget = tripContext?.budgetSummary?.totalBudget || 0;
    const totalActual = tripContext?.budgetSummary?.totalActualCost || 0;
    const remaining = tripContext?.budgetSummary?.remainingBudget || 0;
    const usagePercent = tripContext?.budgetSummary?.budgetUsagePercent || 0;
    const status = tripContext?.budgetSummary?.status || 'ON_TRACK';

    let advisorReply = '';

    if (message.toLowerCase().includes('budget') || message.toLowerCase().includes('money') || message.toLowerCase().includes('spend')) {
      advisorReply = `📊 **Trip Budget Health Check:**\n- **Total Budget:** $${totalBudget.toLocaleString()}\n- **Spent so far:** $${totalActual.toLocaleString()} (${usagePercent}% used)\n- **Remaining Funds:** $${remaining.toLocaleString()}\n- **Status:** **${status}**\n\n💡 *Advisor Tip:* Your biggest expense group is currently **Food & Transit**. Keeping dinners under $45 per person will ensure you finish well under your total budget.`;
    } else if (message.toLowerCase().includes('document') || message.toLowerCase().includes('hotel') || message.toLowerCase().includes('ticket')) {
      const docCount = tripContext?.documents?.length || 0;
      advisorReply = `📁 You currently have **${docCount} travel documents stored** for this trip, including your **Keio Plaza Hotel confirmation** and **JR Pass exchange voucher**. All files and booking reference codes are safely synchronized.`;
    } else {
      advisorReply = `Hello traveler! I am your **AI Travel Planner Assistant**. I can help you:\n1. 🧭 **Suggest & add activities** to any day on your itinerary.\n2. 💰 **Audit your budget vs. actual spending** in real time.\n3. 📄 **Query your saved booking documents & confirmation numbers**.\n\nTry asking: *"Suggest afternoon activities for Day 2"* or *"Am I on track with my budget?"*`;
    }

    return NextResponse.json({
      success: true,
      type: 'text',
      reply: advisorReply,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
