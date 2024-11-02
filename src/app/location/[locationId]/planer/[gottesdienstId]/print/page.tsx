import {notFound, redirect} from "next/navigation";
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import Zeitplan from "@/components/Zeitplan";
import db from "@/lib/db";


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
        location = await db.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }
        })

        sections = await db.zeitplan.findMany({
            where: {
                gottesdienstId: params.gottesdienstId
            },
            orderBy: {
                timeFrom: 'asc'
            },
        })

        gottesdienst = await db.gottesdienst.findUnique({
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

    }

    if (!location) {
        return notFound()
    }

    return (
        <Zeitplan gottesdienst={gottesdienst} sections={sections}/>
    );

}

export default Page;