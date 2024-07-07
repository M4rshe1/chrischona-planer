import LocationLayout from "@/components/locationLayout";
import {authOptions, UserSession} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient} from "@prisma/client";


const page = async ({params}: { params: { locationId: string } }) => {
    const prisma = new PrismaClient()
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
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

    const user_location_role = location.Users.find((user) => user.userId === session.user.id)?.relation ?? "VIEWER"

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <div>
                <h1>Bulk Actions Page</h1>
            </div>
        </LocationLayout>
    )
}

export default page;