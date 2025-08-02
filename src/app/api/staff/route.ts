'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET all staff
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const staff = await db.collection('staff').find({}).toArray();
    const staffWithId = staff.map(member => ({...member, id: member._id.toString()}));
    return NextResponse.json(staffWithId);
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new staff member
export async function POST(request: Request) {
    try {
        const newStaffData = await request.json();
        
        if (!newStaffData.name || !newStaffData.role || !newStaffData.email) {
            return NextResponse.json({ message: 'Name, role, and email are required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        const result = await db.collection('staff').insertOne(newStaffData);
        
        const newStaff = {
            id: result.insertedId.toString(),
            ...newStaffData
        };

        return NextResponse.json(newStaff, { status: 201 });

    } catch (error) {
        console.error('Failed to create staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
