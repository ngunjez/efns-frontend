import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'ash_session';

export function proxy(request: NextRequest) {
  if (env.useMocks || request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const signIn = new URL('/staff/sign-in', request.url);
  signIn.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ['/desk/:path*', '/admin/:path*', '/hub/:path*', '/display/:path*'],
};
