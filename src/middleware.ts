import {NextRequest, NextResponse} from 'next/server';
import {PrismaClient} from '@prisma/client';
import {getToken, JWT} from "next-auth/jwt";

const prisma = new PrismaClient();

function extractLocationIdFromPath(pathname: string): string | null {
    const match = pathname.match(/\/location\/(\w+)/);
    return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered:", request.url);

    try {
        const token: JWT | null = await getToken({req: request});
        const isAuthenticated = !!token;

        const publicPaths = ['/', '/auth/login', '/favicon.ico']; // Add more if needed

        if (!isAuthenticated && !publicPaths.includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/auth/login?callbackUrl=' + encodeURIComponent(request.url), request.url));
        }

        const url = new URL(request.url);

        if (url.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (url.pathname === '/location') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (url.pathname.startsWith('/location') && token?.role !== 'ADMIN') {
            const locationId = extractLocationIdFromPath(url.pathname);
            // @ts-ignore
            if (!locationId || !(token?.locations.map((location) => location.id).includes(locationId))) {
                return NextResponse.redirect(new URL('/access/request/' + locationId, request.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return new NextResponse("Authorization error", {status: 500});
    }
}

export const config = {
    matcher: [
        '/((?!api|_next|static|favicon.ico).*)',
    ],
};
