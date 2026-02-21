import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        })

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Only attempt to create the client if we have a valid-looking URL
        if (supabaseUrl && supabaseUrl.startsWith('http')) {
            const supabase = createServerClient(
                supabaseUrl,
                supabaseKey || '',
                {
                    cookies: {
                        getAll() {
                            return request.cookies.getAll()
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                            response = NextResponse.next({
                                request,
                            })
                            cookiesToSet.forEach(({ name, value, options }) =>
                                response.cookies.set(name, value, options)
                            )
                        },
                    },
                }
            )

            const { data: { user } } = await supabase.auth.getUser();

            if (!user && pathname !== '/admin/login') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        } else {
            console.error('Proxy: Invalid or missing NEXT_PUBLIC_SUPABASE_URL');
            // Optionally redirect to a setup page or just allow the request to proceed (might fail downstream)
        }

        return response;
    }

    // Handle i18n for public routes
    return intlMiddleware(request);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
