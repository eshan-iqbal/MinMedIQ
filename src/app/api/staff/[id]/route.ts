'use server';

import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a proper database.
let staffData = [
  { id: '1', name: 'Admin User', role: 'Admin', email: 'admin@minmediq.com' },
  { id: '2', name: 'Pharma One', role: 'Pharmacist', email: 'pharma1@minmediq.com' },
  { id: '3', name: 'Cashier One', role: 'Cashier', email: 'cashier1@minmediq.com' },
];

// GET a single staff member by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const staff = staffData.find(c => c.id === params.id);
  if (staff) {
    return NextResponse.json(staff);
  }
  return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
}

// PUT (update) a staff member by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedData = await request.json();
    const staffIndex = staffData.findIndex(c => c.id === params.id);

    if (staffIndex === -1) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
    }
    
    // In a real app, you wouldn't be able to update an id, but for this mock API it's fine.
    staffData[staffIndex] = { ...staffData[staffIndex], ...updatedData, id: params.id };
    return NextResponse.json(staffData[staffIndex]);

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
  const staffIndex = staffData.findIndex(c => c.id === params.id);
  if (staffIndex > -1) {
    staffData.splice(staffIndex, 1);
    return NextResponse.json({ message: 'Staff member deleted' });
  }
  return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
}
