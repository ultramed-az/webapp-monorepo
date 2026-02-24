import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { ADMIN_AUTH_COOKIE } from './lib/admin-api';

const intlMiddleware = createMiddleware(routing);
const API_BASE_URL = (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:5555'
).replace(/\/$/, '');
const AUTH_CHECK_TIMEOUT_MS = 2500;

function stripLocalePrefix(pathname: string): string {
    return pathname.replace(/^\/(az|en|ru)(?=\/|$)/, '') || '/';
}

function getLocaleFromPathname(pathname: string): string {
    const locale = pathname.split('/')[1];
    if (routing.locales.includes(locale as 'az' | 'en' | 'ru')) {
        return locale;
    }
    return routing.defaultLocale;
}

async function hasValidAdminSession(token: string, request: NextRequest): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AUTH_CHECK_TIMEOUT_MS);
    const userAgent = request.headers.get('user-agent');

    try {
        const response = await fetch(`${API_BASE_URL}/admin/session`, {
            method: 'GET',
            headers: {
                cookie: `${ADMIN_AUTH_COOKIE}=${token}`,
                ...(userAgent ? { 'user-agent': userAgent } : {}),
                ...(userAgent
                    ? { 'x-ultramed-client-user-agent': userAgent }
                    : {}),
            },
            cache: 'no-store',
            signal: controller.signal,
        });

        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
}

function buildAdminLoginRedirect(request: NextRequest): NextResponse {
    const locale = getLocaleFromPathname(request.nextUrl.pathname);
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    const returnPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set('next', returnPath);
    return NextResponse.redirect(loginUrl);
}

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const normalizedPath = stripLocalePrefix(pathname);
    const isAdminRoute = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');
    const isAdminLoginRoute =
        normalizedPath === '/admin/login' || normalizedPath.startsWith('/admin/login/');

    if (isAdminRoute && !isAdminLoginRoute) {
        const authToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
        if (!authToken) {
            return buildAdminLoginRedirect(request);
        }

        const isValid = await hasValidAdminSession(authToken, request);
        if (!isValid) {
            return buildAdminLoginRedirect(request);
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ['/', '/admin/:path*', '/(az|en|ru)/:path*']
};
