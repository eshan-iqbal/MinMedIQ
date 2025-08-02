'use server';

import { NextResponse } from 'next/server';

// In-memory data store
let customersData = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '123-456-7890',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, USA',
    creditLimit: 5000,
    prescriptionNotes: 'Allergic to penicillin.'
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '987-654-3210',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Othertown, USA',
    creditLimit: 10000,
    prescriptionNotes: ''
  },
  {
    id: '3',
    name: 'Peter Jones',
    mobile: '555-555-5555',
    email: 'peter.jones@example.com',
    address: '789 Pine Ln, Sometown, USA',
    creditLimit: 2500,
    prescriptionNotes: 'Needs monthly refill for diabetes medication.'
  },
];

// GET all customers
export async function GET() {
  return NextResponse.json(customersData);
}

// POST a new customer
export async function POST(request: Request) {
    try {
        const newCustomerData = await request.json();
        
        if (!newCustomerData.name || !newCustomerData.mobile) {
            return NextResponse.json({ message: 'Name and mobile are required' }, { status: 400 });
        }

        const newCustomer = {
            id: `C${Date.now()}`,
            ...newCustomerData,
        };
        customersData.push(newCustomer);
        
        return NextResponse.json(newCustomer, { status: 201 });

    } catch (error) {
        console.error('Failed to create customer:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

    