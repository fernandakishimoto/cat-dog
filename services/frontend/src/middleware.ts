import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

const PUBLIC_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const supabaseResponse = createClient(request);

  const token = request.cookies.get('access_token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
