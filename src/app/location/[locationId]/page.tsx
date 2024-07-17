import {PrismaClient} from '@prisma/client'
import Link from "next/link";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import LocationLayout from "@/components/locationLayout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import Donut from "@/components/ui/charts/donut";


const LocationPage = async ({params}: { params: { locationId: string } }) => {
    const prisma = new PrismaClient()
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    const locationId = params.locationId;
    let location = null;
    let openRequests = null;
    let teams = null;
    // let gottesdienste = null;
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

        teams = await prisma.team.findMany({
            where: {
                locationId: locationId
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        })

        // gottesdienste = await prisma.gottesdienst.findMany({
        //     where: {
        //         locationId: locationId
        //     },
        //     select: {
        //         dateFrom: true,
        //         besucher: true,
        //     }, orderBy: {
        //         dateFrom: 'asc'
        //     },
        //     take: 55
        // })

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }

    if (!location) {
        return notFound()
    }

    // group by user relation
    // count by relation

    const groupByRelation = location.Users.reduce((acc, user) => {
        // @ts-ignore
        if (!acc[user.relation]) {
            // @ts-ignore
            acc[user.relation] = 0
        }
        // @ts-ignore
        acc[user.relation] += 1
        return acc
    }, {})

    const dataLocationMembers = Object.entries(groupByRelation).map(([name, value]) => {
        return {
            name,
            value
        }
        // @ts-ignore
    }).sort((a, b) => b.value - a.value)

    const dataLocationTeams = teams?.map((team) => {
        return {
            name: team.name,
            value: team.users.length
        }
    }).sort((a, b) => b.value - a.value) ?? []

    // const groupByMonth = gottesdienste?.reduce((acc, gottesdienst) => {
    //     const month = gottesdienst.dateFrom.toLocaleDateString("de-CH", {
    //         year: "numeric",
    //         month: "2-digit",
    //     })
    //     // @ts-ignore
    //     if (!acc[month]) {
    //         // @ts-ignore
    //         acc[month] = []
    //     }
    //     // @ts-ignore
    //     acc[month].push(gottesdienst)
    //     return acc
    // }, {}) ?? {}
    //
    // type Gottesdienst = {
    //     dateFrom: Date,
    //     besucher: number
    // }

    // const dataGottesdienste = Object.entries(groupByMonth).map(([name, value]) => {
    //     const gottesdienste = value as Gottesdienst[]
    //
    //     return {
    //         name,
    //         value: gottesdienste.reduce((acc, gottesdienst) => acc + gottesdienst.besucher, 0) / gottesdienste.length
    //     }
    // }, {})
    //
    //
    // const seriesGottesdientste = [
    //     {
    //         type: "line",
    //         yKey: "value",
    //         xKey: "name",
    //         xName: "Besucher",
    //         interpolation: {type: "smooth"},
    //         connectMissingData: true,
    //     },
    // ]
    //
    // const axisGottesdienste = [
    //     {
    //         type: "number",
    //         position: "left",
    //         title: {
    //             text: "Besucher",
    //         },
    //         nice: true,
    //     },
    // ]

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
                <div
                    className="flex justify-center items-center bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full gap-2 relative"
                >
                    <Donut data={dataLocationMembers} title={"Personen an diesem Standort"}/>
                    <Link href={`/location/${locationId}/team`}
                          className={"absolute top-3 right-4"}
                    >
                        <FontAwesomeIcon icon={fas.faUpRightFromSquare}/>
                    </Link>
                </div>
                <div
                    className="flex justify-center items-center bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full gap-2 relative"
                >
                    <Donut data={dataLocationTeams} title={"Teams an diesem Standort"}/>
                    <Link href={`/location/${locationId}/teams`}
                          className={"absolute top-3 right-4"}
                    >
                        <FontAwesomeIcon icon={fas.faUpRightFromSquare}/>
                    </Link>
                </div>
                {/*<div*/}
                {/*    className="flex justify-center items-center bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full gap-2 relative"*/}
                {/*>*/}
                {/*    <Line data={dataGottesdienste} series={seriesGottesdientste}*/}
                {/*          title={"Durchschnittliche Besucherzahlen"} axis={axisGottesdienste}/>*/}
                {/*    <Link href={`/location/${locationId}/planer`}*/}
                {/*          className={"absolute top-3 right-4"}*/}
                {/*    >*/}
                {/*        <FontAwesomeIcon icon={fas.faUpRightFromSquare}/>*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </main>
        </LocationLayout>
    );
}

export default LocationPage;