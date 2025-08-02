import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { requireAdmin } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const users = await AuthService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, role, shopName, shopAddress, phone } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'chemist', 'drugist'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, chemist, or drugist' },
        { status: 400 }
      );
    }

    const success = await AuthService.updateUser(userId, {
      role: role as 'admin' | 'chemist' | 'drugist',
      shopName,
      shopAddress,
      phone,
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAdmin()(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const success = await AuthService.deleteUser(userId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found or delete failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 