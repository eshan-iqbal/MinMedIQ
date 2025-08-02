'use server';

import { NextResponse } from 'next/server';

// In-memory data store for staff
let staffData = [
  { id: '1', name: 'Admin User', role: 'Admin', email: 'admin@minmediq.com' },
  { id: '2', name: 'Pharma One', role: 'Pharmacist', email: 'pharma1@minmediq.com' },
  { id: '3', name: 'Cashier One', role: 'Cashier', email: 'cashier1@minmediq.com' },
];

// GET all staff
export async function GET() {
  return NextResponse.json(staffData);
}

// POST a new staff member
export async function POST(request: Request) {
    try {
        const newStaffData = await request.json();
        
        if (!newStaffData.name || !newStaffData.role || !newStaffData.email) {
            return NextResponse.json({ message: 'Name, role, and email are required' }, { status: 400 });
        }

        const newStaff = {
            id: `S${Date.now()}`,
            ...newStaffData,
        };
        staffData.push(newStaff);
        
        return NextResponse.json(newStaff, { status: 201 });

    } catch (error) {
        console.error('Failed to create staff:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
