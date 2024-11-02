import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
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
    let accessCodes = null;
    try {
        location = await db.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        accessCodes = await db.access_code.findMany({
            where: {
                locationId: locationId,
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

    const columns = [
        {
            name: "id",
            label: "ID",
            type: "text",
            toggle: false,
            disabled: true
        },
        {
            name: "validuntil",
            label: "Gültig bis",
            type: "date",
            toggle: true,
            disabled: false
        },
        {
            name: "maxuses",
            label: "Max. Verwendungen",
            type: "number",
            toggle: true,
            disabled: false,
            min: 0,
            max: 100
        },
        {
            name: "used",
            label: "Verwendungen",
            type: "number",
            toggle: true,
            disabled: true,
            min: 0,
            max: 100
        },
        {
            name: "approvalNeeded",
            label: "Freigabe benötigt",
            type: "checkbox",
            toggle: true,
            disabled: false
        },
        {
            name: "link",
            label: "Link",
            type: "link",
            toggle: true,
            disabled: true
        },
    ]

    async function handleSave(value: any, row: any, name: string) {
        "use server"

        try {
            await db.access_code.update({
                where: {
                    id: row.id
                },
                data: {
                    [name]: value
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }

        revalidatePath(`/location/${locationId}/access`)
    }

    async function handleDelete(item: any) {
        "use server"

        try {
            await db.access_code.delete({
                where: {
                    id: item.id
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath(`/location/${locationId}/access`)
    }

    async function handleCreate() {
        "use server"

        try {
            const validuntil = new Date()
            validuntil.setDate(validuntil.getDate() + 7)
            await db.access_code.create({
                data: {
                    locationId: locationId,
                    validuntil: validuntil,
                    maxuses: 1,
                    used: 0,
                    approvalNeeded: false
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath(`/location/${locationId}/access`)
    }

    accessCodes = accessCodes?.map((code) => {
        return {
            id: code.id,
            validuntil: code.validuntil,
            maxuses: code.maxuses,
            used: code.used,
            link: process.env.NEXTAUTH_URL + "/access/code/" + code.id,
            approvalNeeded: code.approvalNeeded

        }
    })


    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >

                    <EditableTable data={accessCodes}
                                   saveHandler={handleSave}
                                   createHandler={handleCreate}
                                   deleteHandler={handleDelete}
                                   columns={columns}
                                   allowEdit={(["MANAGER", "OWNER"].includes(user_location_role) || session.user.role === "ADMIN")}
                                   allowCreate={(["MANAGER", "OWNER"].includes(user_location_role) || session.user.role === "ADMIN")}
                                   allowDelete={(["MANAGER", "OWNER"].includes(user_location_role) || session.user.role === "ADMIN")}
                                   allowFullscreen={true}
                                   allowExport={false}
                                   tableName={"Zugangscodes"}
                    />


                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;