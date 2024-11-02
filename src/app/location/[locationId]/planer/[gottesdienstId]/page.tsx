import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {RelationRoleLocation} from "@prisma/client";
import {fas} from "@fortawesome/free-solid-svg-icons";
import EditableTable from "@/components/editableTable";
import {revalidatePath} from "next/cache";
import db from "@/lib/db";


const page = async ({params}: { params: { locationId: string, gottesdienstId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let sections = null;
    try {
        location = await db.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }
        })

        sections = await db.zeitplan.findMany({
            where: {
                gottesdienstId: params.gottesdienstId
            },
            orderBy: {
                timeFrom: 'asc'
            },
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
            name: "timeFrom",
            label: "Von",
            type: "time",
            toggle: true,
            disabled: false
        },
        {
            name: "durationMin",
            label: "Dauer in Min",
            type: "number",
            toggle: true,
            disabled: false
        },
        {
            name: "was",
            label: "Was",
            type: "textarea",
            toggle: true,
            disabled: false
        },
        {
            name: "wer",
            label: "Wer",
            type: "textarea",
            toggle: true,
            disabled: false
        },
        {
            name: "bild_ton",
            label: "Bild/Ton",
            type: "textarea",
            toggle: true,
            disabled: false
        },
    ]

    async function handleDelete(item: any) {
        "use server"
        try {
            await db.zeitplan.delete({
                where: {
                    id: item.id
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath(`/location/${locationId}/planer/${params.gottesdienstId}`)
    }

    async function handleSave(value: any, item: any, name: string) {
        "use server"
        try {
            await db.zeitplan.update({
                where: {
                    id: item.id
                },
                data: {
                    [name]: value
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath(`/location/${locationId}/planer/${params.gottesdienstId}`)
    }

    async function handlePrint() {
        "use server"
        redirect(`/location/${locationId}/planer/${params.gottesdienstId}/print`)
    }

    async function handleCreate() {
        "use server"

        try {
            const latest = await db.zeitplan.findMany({
                where: {
                    gottesdienstId: params.gottesdienstId
                },
                orderBy: {
                    timeFrom: 'desc'
                },
            })
            const latestTime = latest[0]?.timeFrom
            const latestDuration = latest[0]?.durationMin
            let newTimeString = "09:45"
            if (latestTime && latestDuration) {
                const newTime = new Date()
                newTime.setHours(parseInt(latestTime.split(":")[0]))
                newTime.setMinutes(parseInt(latestTime.split(":")[1]) + latestDuration)
                const hours = newTime.getHours().toString().padStart(2, '0');
                const minutes = newTime.getMinutes().toString().padStart(2, '0');
                newTimeString = `${hours}:${minutes}`;
            }
            if (newTimeString.length < 5) newTimeString = "0" + newTimeString

            await db.zeitplan.create({
                data: {
                    gottesdienstId: params.gottesdienstId,
                    timeFrom: newTimeString,
                }
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath(`/location/${locationId}/planer/${params.gottesdienstId}`)
    }

    const headerActions = [
        {
            handler: handlePrint,
            tooltip: "Drucken",
            icon: fas.faPrint,
            style: "btn-neutral"
        }
    ]


    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <main
                className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
            >
                <EditableTable data={sections}
                               saveHandler={handleSave}
                               createHandler={handleCreate}
                               deleteHandler={handleDelete}
                               columns={columns}
                               allowEdit={user_location_role != RelationRoleLocation.VIEWER}
                               allowCreate={user_location_role != RelationRoleLocation.VIEWER}
                               allowDelete={user_location_role != RelationRoleLocation.VIEWER}
                               allowFullscreen={true}
                               allowExport={false}
                               tableName={"Zeitplan"}
                               headerActions={headerActions}
                               allowFilter={false}
                />
            </main>
        </LocationLayout>
    )
}

export default page;