import {PrismaClient} from '@prisma/client'
import Link from "next/link";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import LocationLayout from "@/components/locationLayout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";


const LocationPage = async ({params}: { params: { locationId: string } }) => {
    const prisma = new PrismaClient()
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    const locationId = params.locationId;
    let location = null;
    let openRequests = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: {
                    include: {
                        user: true
                    }
                }
            }
        })

        openRequests = await prisma.access_request.aggregate({
            _count: {
                status: true
            },
            where: {
                locationId: locationId,
                status: "PENDING"

            }
        })
        openRequests = openRequests ? openRequests : {_count: {status: 0}}

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
                className={"grid items-center justify-start w-full h-full p-4 md:grid-cols-2 grid-cols-1 gap-4 md:grid-rows-2"}
            >
                <div
                    className="grid grid-cols-2 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full gap-2"
                >
                    <h1
                        className={"font-bold text-center col-span-2"}
                    >Über diesen Standort</h1>
                    <div>
                        <p
                            className={"text-sm"}
                        >Name</p>
                        <p
                            className={"font-bold text-lg"}
                        >{location.name}</p>
                    </div>
                    <Link
                        href={`/location/${locationId}/team`}
                    >
                        <p
                            className={"text-sm"}
                        >Team Mitglieder <FontAwesomeIcon icon={fas.faUpRightFromSquare}/></p>
                        <p
                            className={"font-bold text-lg"}
                        >{location.Users.filter((user) => user.relation !== "VIEWER").length}</p>
                    </Link>
                    <div>
                        <p
                            className={"text-sm"}
                        >Besitzer</p>
                        <p
                            className={"font-bold text-lg"}
                        >{
                            location.Users.filter((user) => user.relation === "OWNER").map((user) => user.user.name).join("<br/>")
                        }</p>
                    </div>
                    <Link
                        href={`/location/${locationId}/requests`}
                    >
                        <p
                            className={"text-sm"}
                        >
                            Offene Anfragen <FontAwesomeIcon icon={fas.faUpRightFromSquare}/>
                        </p>
                        <p
                            className={"font-bold text-lg"}
                        >
                            {openRequests?._count?.status}
                        </p>
                    </Link>
                </div>
            </main>
        </LocationLayout>
    );
}

export default LocationPage;