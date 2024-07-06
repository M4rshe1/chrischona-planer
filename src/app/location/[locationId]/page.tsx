import {PrismaClient} from '@prisma/client'
import Link from "next/link";
import {authOptions, UserSession} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {headers} from "next/headers";
import LocationLayout from "@/components/locationLayout";


const prisma = new PrismaClient()

const LocationPage = async ({params}: { params: { locationId: string } }) => {
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


    const user_location_role = location.Users.find((user) => user.userId as string == session.user.id as string)?.relation ?? "VIEWER"

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <main
                className={"grid items-center justify-start w-full h-full p-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 lg:grid-rows-3"}
            >
                <Link href={`/location/${locationId}/edit`}
                      className="flex justify-between mt-4 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full"
                >
                    <h1
                        className={"font-bold text-center"}
                    >Standort bearbeiten</h1>
                </Link>
            </main>
        </LocationLayout>
    );
}

export default LocationPage;