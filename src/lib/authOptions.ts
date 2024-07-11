import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from '@prisma/client';
import {compare} from "bcrypt";

const prisma = new PrismaClient();

async function refreshUserData(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            locations: {
                select: {
                    location: true,
                    relation: true
                }
            }
        }
    });
    await prisma.$disconnect();

    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        locations: user.locations.map((location) => ({
            name: location.location.name,
            address: location.location.address,
            id: location.location.id,
            relation: location.relation
        }))
    };
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        locations: {
                            select: {
                                location: true,
                                relation: true
                            }
                        }
                    }
                });
                await prisma.$disconnect();

                if (!user) {
                    return null;
                }

                const isValid = await compare(credentials.password, user.password);
                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id as string,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    locations: user.locations.map((location) => {
                        return {
                            name: location.location.name,
                            address: location.location.address,
                            id: location.location.id,
                            relation: location.relation
                        };
                    })
                };
            }
        })
    ],
    callbacks: {
        session: async ({session, token}) => {
            return {
                expires: session.expires,
                user: token
            };
        },
        jwt: async ({token, user}) => {
            const u = user as unknown
            if (u) {
                return {
                    ...token,
                    ...u,
                    lastRefresh: Date.now()
                };
            }
            // @ts-ignore
            if (Date.now() - token.lastRefresh > 5 * 60 * 1000) {
                const refreshedUser = await refreshUserData(token.id as string);
                if (refreshedUser) {
                    return {
                        ...token,
                        ...refreshedUser
                    };
                }
            }
            return token;
        },
        async redirect({url, baseUrl}) {
            return baseUrl
        },
    }
};