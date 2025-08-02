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
        price: 2499,
        currency: 'INR',
        billingCycle: 'monthly' as const,
        features: [
          'Up to 100 inventory items',
          'Up to 50 customers',
          'Basic reporting',
          'Email support'
        ],
        limits: {
          users: 2,
          inventory: 100,
          customers: 50
        }
      },
      {
        name: 'premium' as const,
        price: 6499,
        currency: 'INR',
        billingCycle: 'monthly' as const,
        features: [
          'Up to 500 inventory items',
          'Up to 200 customers',
          'Advanced reporting',
          'Priority support',
          'Bulk operations'
        ],
        limits: {
          users: 5,
          inventory: 500,
          customers: 200
        }
      },
      {
        name: 'enterprise' as const,
        price: 16499,
        currency: 'INR',
        billingCycle: 'monthly' as const,
        features: [
          'Unlimited inventory items',
          'Unlimited customers',
          'Advanced analytics',
          '24/7 support',
          'Custom integrations',
          'API access'
        ],
        limits: {
          users: 10,
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

    // Add sample inventory data
    const sampleInventory = [
      {
        name: 'Paracetamol 500mg',
        batch: 'BATCH001',
        expiry: '2025-12-31',
        price: 5.50,
        stock: 150
      },
      {
        name: 'Amoxicillin 250mg',
        batch: 'BATCH002',
        expiry: '2025-06-30',
        price: 12.75,
        stock: 75
      },
      {
        name: 'Omeprazole 20mg',
        batch: 'BATCH003',
        expiry: '2025-09-15',
        price: 18.25,
        stock: 45
      },
      {
        name: 'Cetirizine 10mg',
        batch: 'BATCH004',
        expiry: '2025-11-20',
        price: 8.90,
        stock: 200
      },
      {
        name: 'Ibuprofen 400mg',
        batch: 'BATCH005',
        expiry: '2025-08-10',
        price: 6.25,
        stock: 120
      }
    ];

    // Clear existing inventory and insert sample data
    await db.collection('inventory').deleteMany({});
    await db.collection('inventory').insertMany(sampleInventory);

    // Add sample customers
    const sampleCustomers = [
      {
        name: 'John Doe',
        mobile: '9876543210',
        email: 'john.doe@email.com',
        address: '123 Main Street, City, State 12345',
        creditLimit: 1000.00,
        prescriptionNotes: 'Allergic to penicillin'
      },
      {
        name: 'Jane Smith',
        mobile: '9876543211',
        email: 'jane.smith@email.com',
        address: '456 Oak Avenue, City, State 12345',
        creditLimit: 500.00,
        prescriptionNotes: 'Diabetic patient'
      },
      {
        name: 'Mike Johnson',
        mobile: '9876543212',
        email: 'mike.johnson@email.com',
        address: '789 Pine Road, City, State 12345',
        creditLimit: 750.00,
        prescriptionNotes: 'Hypertension medication'
      },
      {
        name: 'Sarah Wilson',
        mobile: '9876543213',
        email: 'sarah.wilson@email.com',
        address: '321 Elm Street, City, State 12345',
        creditLimit: 300.00,
        prescriptionNotes: 'Regular customer'
      },
      {
        name: 'David Brown',
        mobile: '9876543214',
        email: 'david.brown@email.com',
        address: '654 Maple Drive, City, State 12345',
        creditLimit: 1200.00,
        prescriptionNotes: 'Senior citizen discount'
      }
    ];

    // Clear existing customers and insert sample data
    await db.collection('customers').deleteMany({});
    await db.collection('customers').insertMany(sampleCustomers);

    console.log('Database initialized successfully!');
    console.log('Default admin user: admin@minmediq.com / admin123');
    console.log('Sample inventory items added');
    console.log('Sample customers added');
    
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