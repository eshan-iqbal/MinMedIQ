import { connectToDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface SubscriptionPlan {
  _id: string;
  name: 'basic' | 'premium' | 'enterprise';
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxUsers: number;
  maxInventory: number;
  maxCustomers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  _id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingHistory {
  _id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  invoiceNumber: string;
  billingDate: Date;
  createdAt: Date;
}

export class SubscriptionService {
  static async createSubscriptionPlan(planData: {
    name: 'basic' | 'premium' | 'enterprise';
    price: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly';
    features: string[];
    maxUsers: number;
    maxInventory: number;
    maxCustomers: number;
  }): Promise<SubscriptionPlan> {
    const { client, db } = await connectToDatabase();
    
    const plan: Omit<SubscriptionPlan, '_id'> = {
      ...planData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('subscription_plans').insertOne(plan);
    return { ...plan, _id: result.insertedId.toString() };
  }

  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { client, db } = await connectToDatabase();
    
    const plans = await db.collection('subscription_plans').find({}).toArray();
    return plans.map(plan => ({ ...plan, _id: plan._id.toString() }));
  }

  static async getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const { client, db } = await connectToDatabase();
    
    const plan = await db.collection('subscription_plans').findOne({ _id: new ObjectId(planId) });
    if (!plan) {
      return null;
    }

    return { ...plan, _id: plan._id.toString() };
  }

  static async createUserSubscription(subscriptionData: {
    userId: string;
    planId: string;
    autoRenew?: boolean;
  }): Promise<UserSubscription> {
    const { client, db } = await connectToDatabase();
    
    const plan = await this.getSubscriptionPlanById(subscriptionData.planId);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.billingCycle === 'yearly' ? 12 : 1));

    const subscription: Omit<UserSubscription, '_id'> = {
      userId: subscriptionData.userId,
      planId: subscriptionData.planId,
      status: 'active',
      startDate,
      endDate,
      autoRenew: subscriptionData.autoRenew ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('user_subscriptions').insertOne(subscription);
    return { ...subscription, _id: result.insertedId.toString() };
  }

  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { client, db } = await connectToDatabase();
    
    const subscription = await db.collection('user_subscriptions')
      .findOne({ userId, status: { $in: ['active', 'inactive'] } });
    
    if (!subscription) {
      return null;
    }

    return { ...subscription, _id: subscription._id.toString() };
  }

  static async updateSubscriptionStatus(subscriptionId: string, status: 'active' | 'inactive' | 'expired' | 'cancelled'): Promise<boolean> {
    const { client, db } = await connectToDatabase();
    
    const result = await db.collection('user_subscriptions').updateOne(
      { _id: subscriptionId },
      { 
        $set: { 
          status, 
          updatedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return this.updateSubscriptionStatus(subscriptionId, 'cancelled');
  }

  static async renewSubscription(subscriptionId: string): Promise<boolean> {
    const { client, db } = await connectToDatabase();
    
    const subscription = await db.collection('user_subscriptions').findOne({ _id: subscriptionId });
    if (!subscription) {
      return false;
    }

    const plan = await this.getSubscriptionPlanById(subscription.planId);
    if (!plan) {
      return false;
    }

    const newEndDate = new Date();
    newEndDate.setMonth(newEndDate.getMonth() + (plan.billingCycle === 'yearly' ? 12 : 1));

    const result = await db.collection('user_subscriptions').updateOne(
      { _id: subscriptionId },
      { 
        $set: { 
          status: 'active',
          endDate: newEndDate,
          updatedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  static async createBillingRecord(billingData: {
    userId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    invoiceNumber: string;
  }): Promise<BillingHistory> {
    const { client, db } = await connectToDatabase();
    
    const billingRecord: Omit<BillingHistory, '_id'> = {
      ...billingData,
      billingDate: new Date(),
      createdAt: new Date(),
    };

    const result = await db.collection('billing_history').insertOne(billingRecord);
    return { ...billingRecord, _id: result.insertedId.toString() };
  }

  static async getBillingHistory(userId: string): Promise<BillingHistory[]> {
    const { client, db } = await connectToDatabase();
    
    const billingRecords = await db.collection('billing_history')
      .find({ userId })
      .sort({ billingDate: -1 })
      .toArray();
    
    return billingRecords.map(record => ({ ...record, _id: record._id.toString() }));
  }

  static async checkSubscriptionExpiry(): Promise<void> {
    const { client, db } = await connectToDatabase();
    
    const expiredSubscriptions = await db.collection('user_subscriptions')
      .find({ 
        status: 'active',
        endDate: { $lt: new Date() }
      })
      .toArray();

    for (const subscription of expiredSubscriptions) {
      await this.updateSubscriptionStatus(subscription._id.toString(), 'expired');
    }
  }

  static async getSubscriptionUsage(userId: string): Promise<{
    currentUsers: number;
    currentInventory: number;
    currentCustomers: number;
    limits: {
      maxUsers: number;
      maxInventory: number;
      maxCustomers: number;
    };
  }> {
    const { client, db } = await connectToDatabase();
    
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const plan = await this.getSubscriptionPlanById(subscription.planId);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    const [userCount, inventoryCount, customerCount] = await Promise.all([
      db.collection('users').countDocuments({ createdBy: userId }),
      db.collection('inventory').countDocuments({ userId }),
      db.collection('customers').countDocuments({ userId }),
    ]);

    return {
      currentUsers: userCount,
      currentInventory: inventoryCount,
      currentCustomers: customerCount,
      limits: {
        maxUsers: plan.maxUsers,
        maxInventory: plan.maxInventory,
        maxCustomers: plan.maxCustomers,
      },
    };
  }
} 