import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next();

  const auth = req.headers.get('authorization');
  const user = process.env.ADMIN_BASIC_USER || 'admin';
  const pass = process.env.ADMIN_BASIC_PASS || 'admin';
  // btoa/atob disponíveis no Edge runtime
  const expected = `Basic ${btoa(`${user}:${pass}`)}`;
  if (auth === expected) return NextResponse.next();

  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="BemViver"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};
