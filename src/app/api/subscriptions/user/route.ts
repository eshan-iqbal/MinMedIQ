import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscription';
import { requireAnyRole } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAnyRole()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    const subscription = await SubscriptionService.getUserSubscription(user.userId);
    
    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
      });
    }

    const plan = await SubscriptionService.getSubscriptionPlanById(subscription.planId);
    const usage = await SubscriptionService.getSubscriptionUsage(user.userId);

    return NextResponse.json({
      success: true,
      subscription: {
        ...subscription,
        plan,
        usage,
      },
    });
  } catch (error) {
    console.error('Get user subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAnyRole()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult;
    const { planId, autoRenew = true } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const subscription = await SubscriptionService.createUserSubscription({
      userId: user.userId,
      planId,
      autoRenew,
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error: any) {
    console.error('Create user subscription error:', error);
    
    if (error.message === 'Subscription plan not found') {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAnyRole()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { action, subscriptionId } = await request.json();

    if (!action || !subscriptionId) {
      return NextResponse.json(
        { error: 'Action and subscription ID are required' },
        { status: 400 }
      );
    }

    let success = false;

    switch (action) {
      case 'cancel':
        success = await SubscriptionService.cancelSubscription(subscriptionId);
        break;
      case 'renew':
        success = await SubscriptionService.renewSubscription(subscriptionId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be cancel or renew' },
          { status: 400 }
        );
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Operation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscription ${action}ed successfully`,
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 