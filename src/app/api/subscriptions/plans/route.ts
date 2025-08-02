import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscription';
import { requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const plans = await SubscriptionService.getSubscriptionPlans();
    
    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const planData = await request.json();

    if (!planData.name || !planData.price || !planData.billingCycle) {
      return NextResponse.json(
        { error: 'Name, price, and billing cycle are required' },
        { status: 400 }
      );
    }

    const plan = await SubscriptionService.createSubscriptionPlan(planData);

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error('Create subscription plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 