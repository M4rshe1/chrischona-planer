import NextAuth, {NextAuthOptions} from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from '@prisma/client'
import {compare} from "bcrypt";

const prisma = new PrismaClient()

export type UserSession = {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        iat: number;
        exp: number;
        jti: string;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: "Email", type: "email" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                prisma.$disconnect()

                if (!user) {
                    return null
                }

                const isValid = await compare(credentials.password, user.password)
                if (!isValid) {
                    return null
                }


                return {
                    id: user.id as string,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
            return {
                expires: session.expires,
                user: token
            }
        },
        jwt: async ({ token, user }) => {
            const u = user as unknown as any
            if (u) {
                return { ...token,
                    ...u
                }
            }
            return token
        }
    }
}

prisma.$disconnect()

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}