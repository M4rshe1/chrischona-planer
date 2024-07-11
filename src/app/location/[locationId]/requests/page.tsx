import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation, Status} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {fas} from "@fortawesome/free-solid-svg-icons";
import CustomTable from "@/components/customTable";
import Loading from "@/app/loading";
import {Suspense} from "react";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    const locationId = params.locationId;
    let location = null;
    let anfragen = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        anfragen = await prisma.access_request.findMany({
            where: {
                locationId: locationId,
                status: "PENDING"
            },
            include: {
                user: true
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

    const actions = [
        {
            tooltip: "Genehmigen",
            icon: fas.faCheck,
            action: handleApprove,
            style: " btn-neutral hover:bg-success hover:text-white"
        },
        {
            tooltip: "Ablehnen",
            icon: fas.faTimes,
            action: handledeny,
            style: " btn-neutral hover:bg-error hover:text-white"
        }
    ]


    const columns = [
        {
            name: "id",
            label: "ID",
            type: "hidden",
            toggle: false,
            disabled: true
        },
        {
            name: "message",
            label: "Nachricht",
            type: "text",
            toggle: true,
            disabled: true
        },
        {
            name: "username",
            label: "Benutzer",
            type: "text",
            toggle: true,
            disabled: true
        },
        {
            name: "email",
            label: "Email",
            type: "text",
            toggle: true,
            disabled: true
        },
        {
            name: "relation",
            label: "Relation",
            type: "select",
            multiple: false,
            options: Object.values(RelationRoleLocation).map((value) => {
                return {
                    value: value,
                    id: value
                }
            }),
            keys: {
                value: "value",
                id: "id"
            },
            toggle: true,
            disabled: false
        }
    ]


    anfragen = anfragen?.map((anfrage) => {
        return {
            id: anfrage.id,
            locationId: anfrage.locationId,
            userId: anfrage.userId,
            message: anfrage.message,
            username: anfrage.user.name,
            email: anfrage.user.email,
            relation: [{value: anfrage.relation, id: anfrage.relation}]
        }
    })


    const groupedAnfragen = {
        alle: anfragen
    }
    const dropdown = Object.keys(groupedAnfragen)

    async function handleApprove(item: any) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.access_request.update({
                where: {
                    id: item.id
                },
                data: {
                    status: Status.APPROVED
                }
            })

            await prisma.user_location.create({
                data: {
                    locationId: locationId,
                    userId: item.userId,
                    relation: item.relation
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/requests`)
    }

    async function handledeny(item: any) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.access_request.update({
                where: {
                    id: item.id
                },
                data: {
                    status: Status.DECLINED
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/requests`)
    }

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >
                    <CustomTable columns={columns} data={groupedAnfragen} dropdown={dropdown} tableName={'requests'}
                                 editButton={false} deleteButton={false}
                                 actions={actions} selectMenu={false}

                    />
                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;