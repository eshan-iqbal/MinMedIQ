'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET all customers
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const customers = await db.collection('customers').find({}).toArray();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new customer
export async function POST(request: Request) {
    try {
        const newCustomerData = await request.json();
        
        if (!newCustomerData.name || !newCustomerData.mobile) {
            return NextResponse.json({ message: 'Name and mobile are required' }, { status: 400 });
        }
        
        const { db } = await connectToDatabase();
        const result = await db.collection('customers').insertOne(newCustomerData);
        
        const newCustomer = {
            id: result.insertedId.toString(),
            ...newCustomerData,
        };
        
        return NextResponse.json(newCustomer, { status: 201 });

    } catch (error) {
        console.error('Failed to create customer:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
