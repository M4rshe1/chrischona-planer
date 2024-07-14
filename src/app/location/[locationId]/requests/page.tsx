import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {EditableTableRowAction, UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation, Status} from "@prisma/client";
import {revalidatePath} from "next/cache";
import {fas} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/loading";
import {Suspense} from "react";
import EditableTable from "@/components/editableTable";


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

    const actions: EditableTableRowAction[] = [
        {
            tooltip: "Genehmigen",
            icon: fas.faCheck,
            handler: handleApprove,
            style: " btn-neutral hover:bg-success hover:text-white"
        },
        {
            tooltip: "Ablehnen",
            icon: fas.faTimes,
            handler: handledeny,
            style: " btn-neutral hover:bg-error hover:text-white"
        }
    ]


    const columns = [
        {
            name: "id",
            label: "ID",
            type: "text",
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
            options: Object.values(RelationRoleLocation).map((value) => {
                return {
                    label: value,
                    value: value
                }
            }),
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

    async function handleDelete(item: any) {
        "use server"
        return revalidatePath(`/location/${locationId}/requests`)
    }

    async function handleSave(value: any, row: any, column: any) {
        "use server"
        return revalidatePath(`/location/${locationId}/requests`)
    }

    async function handleCreate() {
        "use server"
        return revalidatePath(`/location/${locationId}/requests`)
    }

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >
                    <EditableTable
                        columns={columns}
                        data={anfragen}
                        rowActions={actions}
                        headerActions={[]}
                        saveHandler={handleSave}
                        createHandler={handleCreate}
                        deleteHandler={handleDelete}
                        allowEdit={false}
                        allowCreate={false}
                        allowDelete={false}
                        allowExport={false}
                        allowFullscreen={false}
                        tableName={"Anfragen"}
                    />
                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;