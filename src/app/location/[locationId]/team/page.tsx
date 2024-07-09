import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation} from "@prisma/client";
import CustomTable from "@/components/customTable";
import {revalidatePath} from "next/cache";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
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

        users = await prisma.user.findMany({
            where: {
                locations: {
                    some: {
                        locationId: locationId
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                locations: {
                    where: {
                        locationId: locationId
                    },
                    select: {
                        relation: true,
                        id: true
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

    const user_location_role = location.Users.find((user) => user.userId === session.user.id)?.relation ?? "VIEWER"

    const columns = [
        {
            name: "id",
            label: "ID",
            type: "hidden",
            toggle: false,
            disabled: true
        },
        {
            name: "name",
            label: "Name",
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
                    value: value,
                    id: value
                }
            }),
            multiple: false,
            keys: {
                value: "value",
                id: "id"
            },
            toggle: true,
            disabled: false
        }
    ]


    async function handleDelete(id: string) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.user_location.delete({
                where: {
                    id: id
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/team`)
    }

    async function handleSave(item: any) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.user_location.update({
                where: {
                    id: item.id
                },
                data: {
                    relation: item.relation
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/team`)
    }


    users = users?.map((user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            relation: [{value: user.locations[0].relation, id: user.locations[0].relation}],
            connectionId: user.locations[0].id
        }
    })

    const groupedUsers = {
        alle: users
    }
    const dropdown = Object.keys(groupedUsers)

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <main
                className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
            >
                {

                    <CustomTable columns={columns} data={groupedUsers} dropdown={dropdown} tableName={'team'}
                                 editButton={true} deleteButton={true}
                                 selectMenu={false}
                                 handleDelete={handleDelete}
                                 handleSave={handleSave}

                    />
                }
            </main>
        </LocationLayout>
    )
}

export default page;