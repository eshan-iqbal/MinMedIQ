'use server';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a single customer by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const customer = await db.collection('customers').findOne({ _id: new ObjectId(params.id) });
    
    if (customer) {
      const purchaseHistory = await db.collection('bills').find({ customerId: params.id }).toArray();
      const mappedCustomer = {
          ...customer,
          id: customer._id.toString(),
          _id: undefined, // remove original _id
          purchaseHistory: purchaseHistory.map(bill => ({
              ...bill,
              id: bill._id.toString(),
              _id: undefined
          }))
      };
      return NextResponse.json(mappedCustomer);
    }
    return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
  } catch (error) {
      console.error('Failed to fetch customer:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a customer by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
    }
    const updatedData = await request.json();
    delete updatedData.id; // remove id field before update
    delete updatedData._id;

    const { db } = await connectToDatabase();
    const result = await db.collection('customers').updateOne(
        { _id: new ObjectId(params.id) },
        { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    const updatedCustomer = await db.collection('customers').findOne({ _id: new ObjectId(params.id) });
    return NextResponse.json(updatedCustomer);

  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a customer by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id:string } }
) {
  try {
      if (!ObjectId.isValid(params.id)) {
        return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
      }
      const { db } = await connectToDatabase();
      const result = await db.collection('customers').deleteOne({ _id: new ObjectId(params.id) });

      if (result.deletedCount === 0) {
        return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
      console.error('Failed to delete customer:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
