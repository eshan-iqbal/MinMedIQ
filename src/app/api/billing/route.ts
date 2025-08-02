'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const bill = await request.json();
    const { db } = await connectToDatabase();

    // Decrease stock for each item in the bill
    const stockUpdates = bill.items.map((item: { medicineId: string; quantity: number; }) => {
        if (!ObjectId.isValid(item.medicineId)) {
            throw new Error(`Invalid medicineId: ${item.medicineId}`);
        }
        return db.collection('inventory').updateOne(
            { _id: new ObjectId(item.medicineId) },
            { $inc: { stock: -item.quantity } }
        );
    });

    await Promise.all(stockUpdates);
    
    // Save the bill to the database
    const result = await db.collection('bills').insertOne(bill);

    return NextResponse.json({ message: 'Bill saved successfully', billId: result.insertedId.toString() }, { status: 201 });
  } catch(error) {
      console.error('Failed to save bill:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
