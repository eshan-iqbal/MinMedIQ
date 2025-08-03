import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/middleware';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('Subscription assignment request received');
    
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      console.log('Admin authentication failed');
      return authResult;
    }

    const { userId, planId, autoRenew = true } = await request.json();
    console.log('Request data:', { userId, planId, autoRenew });

    if (!userId || !planId) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'User ID and Plan ID are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    console.log('Database connected');

    // Verify user exists
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      console.log('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('User found:', user.name);

    // Verify plan exists
    const plan = await db.collection('subscription_plans').findOne({ _id: new ObjectId(planId) });
    if (!plan) {
      console.log('Plan not found:', planId);
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }
    console.log('Plan found:', plan.name, 'Billing cycle:', plan.billingCycle);

    // Calculate subscription dates using proper date arithmetic
    const startDate = new Date();
    let endDate = new Date();
    
    // Set end date based on billing cycle using proper date arithmetic
    switch (plan.billingCycle) {
      case 'monthly':
        endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
        break;
      case '6months':
        // Calculate 6 months with more precise date handling
        const targetYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + 6) / 12);
        const targetMonth = (startDate.getMonth() + 6) % 12;
        const targetDay = startDate.getDate();
        
        // Create the target date
        const sixMonthDate = new Date(targetYear, targetMonth, targetDay);
        
        // Check if the date was adjusted due to month length differences
        if (sixMonthDate.getDate() !== targetDay) {
          // Use the last day of the target month
          endDate = new Date(targetYear, targetMonth + 1, 0);
          console.log('6-month calculation: Date adjusted due to month length, using last day of target month');
        } else {
          endDate = sixMonthDate;
          console.log('6-month calculation: Using exact date calculation');
        }
        
        console.log('6-month calculation details:', {
          startDate: startDate.toLocaleDateString(),
          targetYear,
          targetMonth,
          targetDay,
          calculatedDate: endDate.toLocaleDateString(),
          duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + ' days'
        });
        break;
      case 'yearly':
        // Calculate 1 year properly
        endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        break;
      default:
        // Default to monthly
        endDate = new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000));
    }

    console.log('Date calculation:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      billingCycle: plan.billingCycle
    });

    // Check if user already has a subscription
    const existingSubscription = await db.collection('subscriptions').findOne({ userId: userId });
    console.log('Checking for existing subscription with userId:', userId);
    console.log('Existing subscription found:', existingSubscription ? 'Yes' : 'No');
    
    if (existingSubscription) {
      console.log('Updating existing subscription');
      // Update existing subscription
      const updateResult = await db.collection('subscriptions').updateOne(
        { userId: userId },
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
      console.log('Update result:', updateResult);
    } else {
      console.log('Creating new subscription');
      // Create new subscription
      const insertResult = await db.collection('subscriptions').insertOne({
        userId: userId,
        planId: new ObjectId(planId),
        status: 'active',
        startDate,
        endDate,
        autoRenew,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Insert result:', insertResult);
    }
    
    // Verify the subscription was created/updated correctly
    const verifySubscription = await db.collection('subscriptions').findOne({ userId: userId });
    console.log('Verification - Subscription in database:', verifySubscription ? {
      userId: verifySubscription.userId,
      planId: verifySubscription.planId,
      status: verifySubscription.status,
      startDate: verifySubscription.startDate,
      endDate: verifySubscription.endDate
    } : 'Not found');

    console.log('Subscription assignment completed successfully');
    console.log('Final subscription data:', {
      userId,
      planId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      billingCycle: plan.billingCycle,
      planName: plan.name
    });
    return NextResponse.json({
      success: true,
      message: 'Subscription assigned successfully',
      data: {
        userId,
        planId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        billingCycle: plan.billingCycle,
        planName: plan.name
      }
    });
  } catch (error) {
    console.error('Assign subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 