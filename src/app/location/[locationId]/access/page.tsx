import LocationLayout from "@/components/locationLayout";
import {authOptions, UserSession} from "@/app/api/auth/[...nextauth]/route";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation} from "@prisma/client";
import {revalidatePath} from "next/cache";
import CustomTable from "@/components/customTable";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let accessCodes = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        accessCodes = await prisma.access_code.findMany({
            where: {
                locationId: locationId,
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
            name: "validuntil",
            label: "Gültig bis",
            type: "datetime",
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
            type: "hidden",
            toggle: true,
            disabled: true,
            min: 0,
            max: 100
        },
        {
            name: "approvalNeeded",
            label: "Freigabe benötigt",
            type: "boolean",
            toggle: true,
            disabled: false
        },
        {
            name: "link",
            label: "Link",
            type: "hidden",
            toggle: true,
            disabled: true
        },
    ]

    async function handleSave(formData: FormData) {
        "use server"
        const prisma = new PrismaClient()
        const validuntil = new Date(formData.get("validuntil") as string)
        if (!formData.get("id")) {
            try {
                await prisma.access_code.create({
                    data: {
                        locationId: locationId,
                        validuntil: validuntil.toISOString(),
                        maxuses: parseInt(formData.get("maxuses") as string),
                        used: 0,
                        approvalNeeded: formData.get("approvalNeeded") === "on",
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            try {
                await prisma.access_code.update({
                    where: {
                        id: formData.get("id") as string
                    },
                    data: {
                        validuntil: validuntil.toISOString(),
                        maxuses: parseInt(formData.get("maxuses") as string),
                        approvalNeeded: formData.get("approvalNeeded") === "on",
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
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

    const groupedCodes = {
        alle: accessCodes
    }
    const dropdown = Object.keys(groupedCodes)


    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <main
                className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
            >

                <CustomTable columns={columns} data={groupedCodes} dropdown={dropdown} tableName={'access_codes'}
                             addButton={user_location_role != RelationRoleLocation.VIEWER}
                             editButton={user_location_role != RelationRoleLocation.VIEWER}
                             deleteButton={user_location_role != RelationRoleLocation.VIEWER}
                             handleSave={handleSave}
                             selectMenu={false}

                />
            </main>
        </LocationLayout>
    )
}

export default page;