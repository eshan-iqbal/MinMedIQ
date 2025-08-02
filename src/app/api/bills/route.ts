'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET all bills
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const bills = await db.collection('bills').find({}).sort({ billDate: -1 }).toArray();
    
    // Transform the bills to include customer names
    const billsWithCustomerNames = bills.map((bill) => {
      return {
        ...bill,
        customerName: bill.customerName || 'Unknown Customer',
        id: bill._id.toString()
      };
    });

    return NextResponse.json(billsWithCustomerNames);
  } catch (error) {
    console.error('Failed to fetch bills:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 