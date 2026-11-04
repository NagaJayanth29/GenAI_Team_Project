import { NextResponse } from 'next/server';
import { findUserById, getAuditLogs } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json(
      { detail: 'Authentication credentials required.' },
      { status: 401 }
    );
  }

  const user = findUserById(userId);
  if (!user) {
    return NextResponse.json(
      { detail: 'Invalid user session. Please log in again.' },
      { status: 401 }
    );
  }

  // Only admins may access audit logs
  if (user.role !== 'admin') {
    return NextResponse.json(
      { detail: 'Forbidden. Administrator privileges required to view audit logs.' },
      { status: 403 }
    );
  }

  try {
    const data = getAuditLogs();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[audit-logs] Failed to retrieve audit logs:', message);
    return NextResponse.json(
      { detail: 'Internal server error while retrieving audit logs.' },
      { status: 500 }
    );
  }
}
