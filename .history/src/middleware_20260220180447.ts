import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We no longer block /admin routes here with full SSR Database hits,
    // avoiding the "async-waterfalls" bundle issue on the Edge runtime.
    // Authentication is strictly validated via React.cache() in the Server Components (layout.tsx)

    // The only check we do here is a basic forward pass to ensure headers are preserved
    if (pathname.startsWith('/admin')) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        })
    }

    // Handle i18n for public routes
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
