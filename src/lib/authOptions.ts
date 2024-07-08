import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { compare } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
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
        session: async ({ session, token }) => {
            return {
                expires: session.expires,
                user: token
            };
        },
        jwt: async ({ token, user }) => {
            const u = user as unknown as any;
            if (u) {
                return {
                    ...token,
                    ...u
                };
            }
            return token;
        }
    }
};