import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET a specific agency
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = require('mongodb');
    
    const agency = await db.collection('agencies').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!agency) {
      return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
    }
    
    const agencyWithId = { ...agency, id: agency._id.toString() };
    return NextResponse.json(agencyWithId);
  } catch (error) {
    console.error('Failed to fetch agency:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a specific agency
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await request.json();
    const { db } = await connectToDatabase();
    const { ObjectId } = require('mongodb');
    
    const result = await db.collection('agencies').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Agency updated successfully' });
  } catch (error) {
    console.error('Failed to update agency:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a specific agency
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { ObjectId } = require('mongodb');
    
    const result = await db.collection('agencies').deleteOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Agency not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Agency deleted successfully' });
  } catch (error) {
    console.error('Failed to delete agency:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 