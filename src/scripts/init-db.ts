import { connectToDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    const { client, db } = await connectToDatabase();

    // Create default subscription plans
    const defaultPlans = [
      {
        name: 'basic' as const,
        price: 4999,
        currency: 'INR',
        billingCycle: '6months' as const,
        features: [
          'Unlimited inventory items',
          'Unlimited customers',
          'Unlimited users',
          'Basic reporting',
          'Email support',
          '6 months validity'
        ],
        limits: {
          users: -1, // unlimited
          inventory: -1, // unlimited
          customers: -1 // unlimited
        }
      },
      {
        name: 'premium' as const,
        price: 8999,
        currency: 'INR',
        billingCycle: 'yearly' as const,
        features: [
          'Unlimited inventory items',
          'Unlimited customers',
          'Unlimited users',
          'Advanced reporting',
          'Priority support',
          'Bulk operations',
          '1 year validity'
        ],
        limits: {
          users: -1, // unlimited
          inventory: -1, // unlimited
          customers: -1 // unlimited
        }
      },
      {
        name: 'enterprise' as const,
        price: 24999,
        currency: 'INR',
        billingCycle: 'yearly' as const,
        features: [
          'Unlimited inventory items',
          'Unlimited customers',
          'Unlimited users',
          'Advanced analytics',
          '24/7 support',
          'Custom integrations',
          'API access',
          '1 year validity'
        ],
        limits: {
          users: -1, // unlimited
          inventory: -1, // unlimited
          customers: -1 // unlimited
        }
      }
    ];

    // Clear existing plans and insert new ones
    await db.collection('subscription_plans').deleteMany({});
    await db.collection('subscription_plans').insertMany(defaultPlans);

    // Create default admin user if it doesn't exist
    const adminExists = await db.collection('users').findOne({ email: 'admin@minmediq.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@minmediq.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    console.log('Database initialized successfully!');
    console.log('Default admin user: admin@minmediq.com / admin123');
    console.log('Subscription plans created');
    console.log('Ready to start using MinMedIQ!');
    
    await client.close();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

export { initializeDatabase }; 