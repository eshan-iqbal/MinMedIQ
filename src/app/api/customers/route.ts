'use server';

import { NextResponse } from 'next/server';

const customersData = [
  {
    id: '1',
    name: 'John Doe',
    mobile: '123-456-7890',
    address: '123 Main St, Anytown, USA',
  },
  {
    id: '2',
    name: 'Jane Smith',
    mobile: '987-654-3210',
    address: '456 Oak Ave, Othertown, USA',
  },
  {
    id: '3',
    name: 'Peter Jones',
    mobile: '555-555-5555',
    address: '789 Pine Ln, Sometown, USA',
  },
];

export async function GET() {
  return NextResponse.json(customersData);
}

export async function POST(request: Request) {
    const newCustomer = await request.json();
    console.log('Received new customer:', newCustomer);
    // In a real app, you would save to a database and get an ID
    const customer = {
        id: `C${Date.now()}`,
        ...newCustomer
    }
    customersData.push(customer);
    return NextResponse.json(customer, { status: 201 });
}
