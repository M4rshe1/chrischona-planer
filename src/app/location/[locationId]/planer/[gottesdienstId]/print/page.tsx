import {notFound, redirect} from "next/navigation";
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import Zeitplan from "@/components/Zeitplan";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

const Page = async ({params}: { params: { locationId: string, gottesdienstId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    const locationId = params.locationId;
    let location = null;
    let sections = null;
    let gottesdienst = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }
        })

        sections = await prisma.zeitplan.findMany({
            where: {
                gottesdienstId: params.gottesdienstId
            },
            orderBy: {
                timeFrom: 'asc'
            },
        })

        gottesdienst = await prisma.gottesdienst.findUnique({
            where: {
                id: params.gottesdienstId
            },
            include: {
                Gottesdienst_User: {
                    include: {
                        user: true
                    }
                }
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }

    if (!location) {
        return notFound()
    }

    return (
        <Zeitplan gottesdienst={gottesdienst} sections={sections}/>
    );

}

export default Page;