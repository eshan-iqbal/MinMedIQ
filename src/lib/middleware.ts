import { NextRequest, NextResponse } from 'next/server';
import { AuthService, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateToken(request: NextRequest): Promise<NextResponse | JWTPayload> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Access token required' }, { status: 401 });
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return payload;
}

export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | JWTPayload> => {
    const authResult = await authenticateToken(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const user = authResult as JWTPayload;
    
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    return user;
  };
}

export function requireAdmin() {
  return requireRole(['admin']);
}

export function requireAdminOrChemist() {
  return requireRole(['admin', 'chemist']);
}

export function requireAnyRole() {
  return requireRole(['admin', 'chemist', 'drugist']);
} 