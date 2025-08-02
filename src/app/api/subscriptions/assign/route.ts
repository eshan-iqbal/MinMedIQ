import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, planId, autoRenew = true } = await request.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: 'User ID and Plan ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify plan exists
    const plan = await db.collection('subscription_plans').findOne({ _id: new ObjectId(planId) });
    if (!plan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    // Set end date based on billing cycle
    switch (plan.billingCycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '6months':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1); // Default to monthly
    }

    // Check if user already has a subscription
    const existingSubscription = await db.collection('user_subscriptions').findOne({ userId });
    
    if (existingSubscription) {
      // Update existing subscription
      await db.collection('user_subscriptions').updateOne(
        { userId },
        {
          $set: {
            planId: new ObjectId(planId),
            status: 'active',
            startDate,
            endDate,
            autoRenew,
            updatedAt: new Date(),
          }
        }
      );
    } else {
      // Create new subscription
      await db.collection('user_subscriptions').insertOne({
        userId,
        planId: new ObjectId(planId),
        status: 'active',
        startDate,
        endDate,
        autoRenew,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription assigned successfully',
    });
  } catch (error) {
    console.error('Assign subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 