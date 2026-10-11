import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'ash_session';
const MOCKED = process.env.NEXT_PUBLIC_USE_MSW === 'true';

/**
 * First line of the staff route guard: no session cookie, no staff screen.
 * It only checks presence — the API validates the session and the hub on
 * every call, and the shells check permissions per screen. With mocks on
 * there is no real cookie, so the client-side guard does the job instead.
 */
export function proxy(request: NextRequest) {
  if (MOCKED || request.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const signIn = new URL('/staff/sign-in', request.url);
  signIn.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ['/desk/:path*', '/admin/:path*', '/hub/:path*', '/display/:path*'],
};
