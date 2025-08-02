import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';

// GET all inventory items
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const inventory = await db.collection('inventory').find({}).toArray();
    const inventoryWithId = inventory.map(item => ({...item, id: item._id.toString()}));
    return NextResponse.json(inventoryWithId);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new inventory item
export async function POST(request: Request) {
    try {
        const newItemData = await request.json();
        
        const { db } = await connectToDatabase();
        const result = await db.collection('inventory').insertOne(newItemData);
        
        const newItem = {
            id: result.insertedId.toString(),
            ...newItemData,
        };
        
        return NextResponse.json(newItem, { status: 201 });

    } catch (error) {
        console.error('Failed to create inventory item:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
