import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {EditableTableColumn, UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import { RelationRoleLocation} from "@prisma/client";
import {revalidatePath} from "next/cache";
import Loading from "@/app/loading";
import {Suspense} from "react";
import EditableTable from "@/components/editableTable";
import db from "@/lib/db";




const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let users = null;
    try {
        location = await db.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        users = await db.user.findMany({
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
            },
            orderBy: {
                name: 'asc'
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
       
    }

    if (!location) {
        return notFound()
    }

    const user_location_role = location.Users.find((user) => user.userId === session.user.id)?.relation ?? "VIEWER"

    const columns: EditableTableColumn[] = [
        {
            name: "id",
            label: "ID",
            type: "text",
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
            type: "email",
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


    async function handleDelete(item: any) {
        "use server"
        
        try {
            await db.user_location.delete({
                where: {
                    id: item.connectionId
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
           
        }
        return revalidatePath(`/location/${locationId}/team`)
    }

    async function handleSave(value: any, row: any[], name: string) {
        "use server"
        console.log(value, row, name)
        
        try {
            await db.user_location.update({
                where: {
                    // @ts-ignore
                    id: row.connectionId
                },
                data: {
                    relation: value
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
           
        }
        return revalidatePath(`/location/${locationId}/team`)
    }

    users = users?.map((user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            relation: [{value: user.locations[0].relation, label: user.locations[0].relation}],
            connectionId: user.locations[0].id
        }
    })

    async function handleCreate() {
        "use server"
        return null
    }


    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >
                    <EditableTable
                        data={users}
                        saveHandler={handleSave}
                        createHandler={handleCreate}
                        deleteHandler={handleDelete}
                        columns={columns}
                        allowEdit={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'}
                        allowCreate={false}
                        allowDelete={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'}
                        allowFullscreen={true}
                        allowExport={false}
                        tableName={"team"}
                    />
                    {/*<CustomTable columns={columns} data={groupedUsers} dropdown={dropdown} tableName={'team'}*/}
                    {/*             editButton={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'} deleteButton={['OWNER', 'MANAGER'].includes(user_location_role) || session.user.role === 'ADMIN'}*/}
                    {/*             selectMenu={false}*/}
                    {/*             handleDelete={handleDelete}*/}
                    {/*             handleSave={handleSave}*/}

                    {/*/>*/}
                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;