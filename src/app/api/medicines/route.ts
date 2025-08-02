'use server';

import { NextResponse } from 'next/server';

const medicinesData = [
  { id: '1', name: 'Paracetamol 500mg', price: 5.99, stock: 150 },
  { id: '2', name: 'Amoxicillin 250mg', price: 12.5, stock: 80 },
  { id: '3', name: 'Ibuprofen 200mg', price: 8.75, stock: 20 },
  { id: '4', name: 'Cough Syrup', price: 15.00, stock: 5 },
];

export async function GET() {
  return NextResponse.json(medicinesData);
}
