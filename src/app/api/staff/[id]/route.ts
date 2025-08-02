import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single staff member by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid staff ID' }, { status: 400 });
        }
        const { db } = await connectToDatabase();
        const staff = await db.collection('staff').findOne({ _id: new ObjectId(params.id) });
        
        if (staff) {
          const mappedStaff = { ...staff, id: staff._id.toString(), _id: undefined };
          return NextResponse.json(mappedStaff);
        }
        return NextResponse.json({ message: 'Staff not found' }, { status: 404 });
    } catch (error) {
        console.error('Failed to fetch staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT (update) a staff member by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid staff ID' }, { status: 400 });
    }
    const updatedData = await request.json();
    delete updatedData.id;
    delete updatedData._id;

    const { db } = await connectToDatabase();
    const result = await db.collection('staff').updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
    }

    const updatedStaff = await db.collection('staff').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updatedStaff);

  } catch (error) {
    console.error('Failed to update staff member:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a staff member by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        if (!ObjectId.isValid(params.id)) {
            return NextResponse.json({ message: 'Invalid staff ID' }, { status: 400 });
        }
        const { db } = await connectToDatabase();
        const result = await db.collection('staff').deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Staff member deleted' });
    } catch (error) {
        console.error('Failed to delete staff member:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
