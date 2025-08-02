import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { AuthService } from '@/lib/auth';
import { requireAdmin } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    // Check if the request is from an admin
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { email, name, password, role, shopName, shopAddress, phone } = await request.json();

    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { error: 'Email, name, password, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'chemist', 'drugist'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, chemist, or drugist' },
        { status: 400 }
      );
    }

    const user = await AuthService.createUser({
      email,
      name,
      password,
      role: role as 'admin' | 'chemist' | 'drugist',
      shopName,
      shopAddress,
      phone,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        shopName: user.shopName,
        shopAddress: user.shopAddress,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 