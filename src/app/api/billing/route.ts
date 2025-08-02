'use server';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const bill = await request.json();
  console.log('Received bill:', bill);
  // Here you would typically save the bill to a database
  return NextResponse.json({ message: 'Bill saved successfully', billId: `B${Date.now()}` });
}
