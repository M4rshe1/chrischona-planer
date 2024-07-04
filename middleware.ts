import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions, UserSession } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function isUserInLocation(userId: string, locationId: string): Promise<boolean> {
    try {
        const connection = await prisma.user_location.findFirst({
            where: {
                userId,
                locationId,
            },
        });
        return !!connection;
    } catch (error) {
        console.error('Error checking user location:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

function extractLocationIdFromPath(pathname: string): string | null {
    const match = pathname.match(/\/locations\/(\w+)/);
    return match ? match[1] : null;
}

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered:", request.url);

    try {
        const session = await getServerSession(authOptions) as UserSession | null;
        if (!session?.user) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        const { role, id: userId } = session.user;
        const url = new URL(request.url);

        if (url.pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (url.pathname.startsWith('/locations')) {
            if (role !== 'admin') {
                const locationId = extractLocationIdFromPath(url.pathname);
                if (!locationId || !(await isUserInLocation(userId, locationId))) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)"
    ]
};
