import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['az', 'ru', 'en'],
  defaultLocale: 'az',
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return res;
  }

  // Handle i18n for public routes
  const res = intlMiddleware(req);
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|.*\..*).*)']
};
