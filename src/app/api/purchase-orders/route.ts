import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET all purchase orders
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection('purchase_orders').find({}).toArray();
    const ordersWithId = orders.map(order => ({...order, id: order._id.toString()}));
    return NextResponse.json(ordersWithId);
  } catch (error) {
    console.error('Failed to fetch purchase orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new purchase order
export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    const { db } = await connectToDatabase();
    const result = await db.collection('purchase_orders').insertOne(orderData);
    
    const newOrder = {
      id: result.insertedId.toString(),
      ...orderData,
    };
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create purchase order:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 