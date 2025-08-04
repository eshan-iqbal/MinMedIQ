import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET all agencies
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const agencies = await db.collection('agencies').find({}).toArray();
    const agenciesWithId = agencies.map(agency => ({...agency, id: agency._id.toString()}));
    return NextResponse.json(agenciesWithId);
  } catch (error) {
    console.error('Failed to fetch agencies:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new agency
export async function POST(request: Request) {
  try {
    const agencyData = await request.json();
    
    const { db } = await connectToDatabase();
    const result = await db.collection('agencies').insertOne(agencyData);
    
    const newAgency = {
      id: result.insertedId.toString(),
      ...agencyData,
    };
    
    return NextResponse.json(newAgency, { status: 201 });
  } catch (error) {
    console.error('Failed to create agency:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 