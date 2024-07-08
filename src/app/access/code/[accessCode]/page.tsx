import {PrismaClient} from "@prisma/client";
import Link from "next/link";
import {redirect} from "next/navigation";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";


const prisma = new PrismaClient();

const Page = async ({params}: { params: { accessCode: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
    }


    let db_accessCode = null
    let user_in_location = null
    try {
        db_accessCode = await prisma.access_code.findUnique({
            where: {
                id: params.accessCode
            },
            include: {
                location: true
            }
        })

        user_in_location = await prisma.user_location.findFirst({
            where: {
                userId: session.user.id,
                locationId: db_accessCode?.location.id
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }

    if (user_in_location) {
        return redirect("/location/" + db_accessCode?.location.id)
    }

    if (!db_accessCode) {
        return (
            <div
                className={"w-full h-full flex items-center justify-start grow"}
            >
                <main
                    className={"flex flex-col items-center justify-center w-full h-full p-4"}
                >
                    <h1
                        className={'text-2xl text-center'}
                    >Der Zugriffscode ist ungültig</h1>
                    <Link href={"/"} className={"btn-primary btn mt-4"}>
                        Home
                    </Link>
                </main>
            </div>
        )
    }

    if (db_accessCode.validuntil && db_accessCode.validuntil < new Date()) {
        return (
            <div
                className={"w-full h-full flex items-center justify-start grow"}
            >
                <main
                    className={"flex flex-col items-center justify-center w-full h-full p-4"}
                >
                    <h1
                        className={'text-2xl text-center'}
                    >Der Zugriffscode ist abgelaufen</h1>
                    <Link href={"/"} className={"btn-primary btn mt-4"}>
                        Home
                    </Link>
                </main>
            </div>
        )
    }

    if (db_accessCode.maxuses && db_accessCode.maxuses > 0) {
        if (db_accessCode.used >= db_accessCode.maxuses) {
            return (
                <div
                    className={"w-full h-full flex items-center justify-start grow"}
                >
                    <main
                        className={"flex items-center justify-center w-full h-full p-4"}
                    >
                        <h1
                            className={'text-2xl text-center'}
                        >Der Zugriffscode wurde bereits {db_accessCode.used} mal benutzt und ist nicht mehr gültig</h1>
                    </main>
                </div>
            )
        }
    }

    if (db_accessCode.approvalNeeded) {
        await prisma.access_request.create({
            data: {
                locationId: db_accessCode.location.id,
                userId: session.user.id,
                message: "Zugriffsanfrage mit dem Code " + params.accessCode
            }
        })



        return (
            <div
                className={"w-full h-full flex items-center justify-start grow"}
            >
                <main
                    className={"flex items-center justify-center w-full h-full p-4"}
                >
                    <h1
                        className={'text-2xl text-center'}
                    >Eine Zugriffsanfrage wurde an den Standort {db_accessCode.location.name} gesendet</h1>
                </main>
            </div>
        )
    }

    try {
        await prisma.access_code.update({
            where: {
                id: db_accessCode.id
            },
            data: {
                used: db_accessCode.used + 1
            }
        })

        await prisma.user_location.create({
            data: {
                user: {connect: {id: session.user.id}},
                location: {connect: {id: db_accessCode.location.id}}
            }
        })
    } catch
        (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }


    return (
        <div
            className={"w-full h-full flex items-center justify-start grow"}
        >
            <main
                className={"flex items-center justify-center w-full h-full p-4"}
            >
                <h1
                    className={'text-2xl text-center'}
                >Du hast nun Zugriff auf den standort {db_accessCode.location.name}</h1>
                <Link href={"/location/" + db_accessCode.location.id}
                      className={"btn-primary btn mt-4"}
                >
                    Zum Standort
                </Link>
            </main>
        </div>
    );
}

export default Page;