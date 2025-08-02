
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const bill = await request.json();
    const { db } = await connectToDatabase();

    // Generate a unique bill ID
    const billCount = await db.collection('bills').countDocuments();
    const billId = `BILL${String(billCount + 1).padStart(4, '0')}`;

    // Get customer information
    const customer = await db.collection('customers').findOne({ _id: new ObjectId(bill.customerId) });
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    // Decrease stock for each item in the bill
    const stockUpdates = bill.items.map((item: { medicineId: string; quantity: number; isPillBased?: boolean; pillQuantity?: number; pillsPerStrip?: number; }) => {
        if (!ObjectId.isValid(item.medicineId)) {
            throw new Error(`Invalid medicineId: ${item.medicineId}`);
        }
        
        // For pill-based medicines, calculate strips needed
        if (item.isPillBased && item.pillQuantity && item.pillsPerStrip) {
            const stripsNeeded = Math.ceil(item.pillQuantity / item.pillsPerStrip);
            return db.collection('inventory').updateOne(
                { _id: new ObjectId(item.medicineId) },
                { $inc: { stock: -stripsNeeded } }
            );
        } else {
            // For regular medicines
            return db.collection('inventory').updateOne(
                { _id: new ObjectId(item.medicineId) },
                { $inc: { stock: -item.quantity } }
            );
        }
    });

    await Promise.all(stockUpdates);
    
    // Save the bill to the database with additional information
    const billData = {
        ...bill,
        billId,
        customerName: customer.name,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await db.collection('bills').insertOne(billData);

    return NextResponse.json({ 
        message: 'Bill saved successfully', 
        billId: result.insertedId.toString(),
        billNumber: billId
    }, { status: 201 });
  } catch(error) {
      console.error('Failed to save bill:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
