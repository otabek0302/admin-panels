import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
// @ts-ignore
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET, raw: true });
  const isLogin = req.nextUrl.pathname.startsWith('/login');

  if (isLogin && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/'],
};
