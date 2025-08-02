import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateToken } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const userId = authResult.userId;
    const { db } = await connectToDatabase();

    // Get user information
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's subscription
    const subscription = await db.collection('subscriptions').findOne({ userId: userId });
    let subscriptionWithPlan = null;

    if (subscription) {
      // Get subscription plan details
      const plan = await db.collection('subscription_plans').findOne({ _id: subscription.planId });
      
      // Get usage statistics
      const currentUsers = await db.collection('users').countDocuments();
      const currentInventory = await db.collection('inventory').countDocuments();
      const currentCustomers = await db.collection('customers').countDocuments();

      subscriptionWithPlan = {
        ...subscription,
        plan: plan ? {
          _id: plan._id.toString(),
          name: plan.name,
          price: plan.price,
          currency: plan.currency,
          billingCycle: plan.billingCycle,
          features: plan.features,
          maxUsers: plan.maxUsers,
          maxInventory: plan.maxInventory,
          maxCustomers: plan.maxCustomers,
        } : undefined,
        usage: {
          currentUsers,
          currentInventory,
          currentCustomers,
          limits: {
            maxUsers: plan?.maxUsers || 0,
            maxInventory: plan?.maxInventory || 0,
            maxCustomers: plan?.maxCustomers || 0,
          },
        },
      };
    }

    const { password, ...userWithoutPassword } = user;
    const profile = {
      ...userWithoutPassword,
      _id: user._id.toString(),
      subscription: subscriptionWithPlan,
    };

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 