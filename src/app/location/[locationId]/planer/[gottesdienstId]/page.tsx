import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation} from "@prisma/client";
import CustomTable from "@/components/customTable";
import Loading from "@/app/loading";
import {Suspense} from "react";
import {fas} from "@fortawesome/free-solid-svg-icons";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string, gottesdienstId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let sections = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }
        })

        sections = await prisma.zeitplan.findMany({
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
            await prisma.zeitplan.delete({
                where: {
                    id: item.id
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
    }

    async function handleSave(formData: FormData) {
        "use server"
        const id = formData.get("id") as string
        if (id) {
            try {
                await prisma.zeitplan.update({
                    where: {
                        id: id
                    },
                    data: {
                        timeFrom: formData.get("timeFrom") as string,
                        durationMin: parseInt(formData.get("durationMin") as string),
                        was: formData.get("was") as string,
                        wer: formData.get("wer") as string,
                        bild_ton: formData.get("bild_ton") as string,
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            try {
                await prisma.zeitplan.create({
                    data: {
                        timeFrom: formData.get("timeFrom") as string,
                        durationMin: parseInt(formData.get("durationMin") as string),
                        was: formData.get("was") as string,
                        wer: formData.get("wer") as string,
                        bild_ton: formData.get("bild_ton") as string,
                        gottesdienstId: params.gottesdienstId
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        }
    }

    const groupedUsers = {
        alle: sections
    }
    const dropdown = Object.keys(groupedUsers)

    async function handlePrint() {
        "use server"
        redirect(`/location/${locationId}/planer/${params.gottesdienstId}/print`)
    }

    async function handlePreview() {
        "use server"
        redirect(`/location/${locationId}/planer/${params.gottesdienstId}/print?preview=true`)
    }

    const headerActions = [
        {
            handler: handlePrint,
            tooltip: "Drucken",
            icon: fas.faPrint,
            style: "btn-neutral"
        },
        {
            handler: handlePreview,
            tooltip: "Vorschau",
            icon: fas.faEye,
            style: "btn-neutral"
        },
    ]


    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >
                    {

                        <CustomTable columns={columns} data={groupedUsers} dropdown={dropdown} tableName={'team'}
                                     editButton={user_location_role != RelationRoleLocation.VIEWER}
                                     deleteButton={user_location_role != RelationRoleLocation.VIEWER}
                                     addButton={user_location_role != RelationRoleLocation.VIEWER}
                                     selectMenu={false}
                                     handleDelete={handleDelete}
                                     handleSave={handleSave}
                                     headerActions={headerActions}

                        />
                    }
                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;