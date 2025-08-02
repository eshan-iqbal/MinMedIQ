'use server';

import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a proper database.
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

const billsData = [
    { billId: 'B1721758360111', customerId: '1', billDate: '2024-07-23T12:12:40.111Z', grandTotal: 25.48, status: 'Paid' },
    { billId: 'B1721758420543', customerId: '2', billDate: '2024-07-22T10:30:15.543Z', grandTotal: 150.75, status: 'Paid' },
    { billId: 'B1721758480888', customerId: '1', billDate: '2024-07-21T18:45:00.888Z', grandTotal: 75.20, status: 'Credit' },
    { billId: 'B1721758540123', customerId: '3', billDate: '2024-07-20T09:00:12.123Z', grandTotal: 350.00, status: 'Paid' },
]

// GET a single customer by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customer = customersData.find(c => c.id === params.id);
  if (customer) {
    const purchaseHistory = billsData.filter(b => b.customerId === params.id);
    return NextResponse.json({ ...customer, purchaseHistory });
  }
  return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
}

// PUT (update) a customer by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedData = await request.json();
    const customerIndex = customersData.findIndex(c => c.id === params.id);

    if (customerIndex === -1) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    customersData[customerIndex] = { ...customersData[customerIndex], ...updatedData };
    return NextResponse.json(customersData[customerIndex]);

  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a customer by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const customerIndex = customersData.findIndex(c => c.id === params.id);
  if (customerIndex > -1) {
    customersData.splice(customerIndex, 1);
    return NextResponse.json({ message: 'Customer deleted' });
  }
  return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
}

    