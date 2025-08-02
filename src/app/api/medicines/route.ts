'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET all medicines for billing dropdown
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    // Assuming medicines are stored in the 'inventory' collection
    const medicines = await db.collection('inventory').find({}, {
        projection: { name: 1, price: 1, stock: 1 }
    }).toArray();

    const formattedMedicines = medicines.map(med => ({
        id: med._id.toString(),
        name: med.name,
        price: med.price,
        stock: med.stock
    }));

    return NextResponse.json(formattedMedicines);
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
