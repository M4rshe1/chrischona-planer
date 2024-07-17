import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient} from "@prisma/client";
import TeamForm from "@/components/teamForm";
import {revalidatePath} from "next/cache";
import {Suspense} from "react";
import Loading from "@/app/loading";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let Teams = null;
    let users = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        Teams = await prisma.team.findMany({
            where: {
                locationId: locationId
            },
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        id: true
                    }
                }
            },
        })

        console.log(Teams)

        users = await prisma.user.findMany({
            where: {
                locations: {
                    some: {
                        relation: {
                            not: "VIEWER"
                        },
                        locationId: locationId
                    }
                }
            },
            select: {
                id: true,
                name: true
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

    Teams = Teams?.map((team) => {
        return {
            ...team,
            users: team.users.map((user) => {
                return {
                    ...user.user,
                    connectionId: user.id
                }
            })
        }
    })

    const user_location_role = location.Users.find((user) => user.userId === session.user.id)?.relation ?? "VIEWER"

    async function handleAdd(userId: string, teamId: string) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.team_user.create({
                data: {
                    teamId: teamId,
                    userId: userId
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/team`)
    }

    async function handleDelete(connectionId: string) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.team_user.delete({
                where: {
                    id: connectionId
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/team`)
    }

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>

                <main
                    className={"p-4 grid justify-start items-center h-full gap-4 w-full grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1"}
                >
                    {
                        Teams ?
                            Teams.map((team, index) => {
                                return (
                                    <TeamForm team={team} handleAdd={handleAdd} handleDelete={handleDelete}
                                              users={users}
                                              key={index}
                                              showForm={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'}
                                              showDelete={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'}
                                    />
                                )
                            }) : null
                    }
                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;