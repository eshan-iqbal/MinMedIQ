import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'chemist' | 'drugist';
  password: string;
  shopName?: string;
  shopAddress?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'expired';
    startDate: Date;
    endDate: Date;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(user: Omit<User, 'password'>): string {
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'chemist' | 'drugist';
    shopName?: string;
    shopAddress?: string;
    phone?: string;
  }): Promise<Omit<User, 'password'>> {
    const { client, db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(userData.password);
    
    const user: Omit<User, '_id'> = {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      password: hashedPassword,
      shopName: userData.shopName,
      shopAddress: userData.shopAddress,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(user);
    
    const { password, ...userWithoutPassword } = { ...user, _id: result.insertedId.toString() };
    return userWithoutPassword;
  }

  static async authenticateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const { client, db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() };
  }

  static async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const { client, db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() };
  }

  static async updateUser(userId: string, updateData: {
    role?: 'admin' | 'chemist' | 'drugist';
    shopName?: string;
    shopAddress?: string;
    phone?: string;
  }): Promise<boolean> {
    const { client, db } = await connectToDatabase();
    
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  static async updateUserRole(userId: string, newRole: 'admin' | 'chemist' | 'drugist'): Promise<boolean> {
    return this.updateUser(userId, { role: newRole });
  }

  static async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const { client, db } = await connectToDatabase();
    
    const users = await db.collection('users').find({}).toArray();
    
    // Get subscription information for each user
    const usersWithSubscriptions = await Promise.all(
      users.map(async (user) => {
        const { password, ...userWithoutPassword } = user;
        const userData = { ...userWithoutPassword, _id: user._id.toString() };
        
        // Get user's subscription
        const subscription = await db.collection('subscriptions').findOne({ userId: user._id.toString() });
        if (subscription) {
          // Get subscription plan details
          const plan = await db.collection('subscription_plans').findOne({ _id: subscription.planId });
          userData.subscription = {
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
          };
        }
        
        return userData;
      })
    );
    
    return usersWithSubscriptions;
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const { client, db } = await connectToDatabase();
    
    const result = await db.collection('users').deleteOne({ _id: userId });
    return result.deletedCount > 0;
  }
} 