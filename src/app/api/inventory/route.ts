'use server';

import { NextResponse } from 'next/server';

const inventoryData = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    batch: 'P202301',
    expiry: '2025-12-31',
    price: 5.99,
    stock: 150,
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    batch: 'A202305',
    expiry: '2024-11-30',
    price: 12.5,
    stock: 80,
  },
  {
    id: '3',
    name: 'Ibuprofen 200mg',
    batch: 'I202303',
    expiry: '2026-05-31',
    price: 8.75,
    stock: 20,
  },
   {
    id: '4',
    name: 'Cough Syrup',
    batch: 'CS202401',
    expiry: '2025-08-01',
    price: 15.00,
    stock: 5,
  },
];

export async function GET() {
  return NextResponse.json(inventoryData);
}
