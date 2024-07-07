import LocationLayout from "@/components/locationLayout";
import {authOptions, UserSession} from "@/app/api/auth/[...nextauth]/route";
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
    let gottestdienste = null;
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

        gottestdienste = await prisma.gottesdienst.findMany({
            where: {
                locationId: locationId
            },
            include: {
                Gottesdienst_User: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                dateFrom: "asc"
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
                teams: {
                    select: {
                        name: true
                    }
                },
                abwesenheiten: {
                    select: {
                        dateFrom: true,
                        dateTo: true
                    }
                },
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

    gottestdienste = gottestdienste?.map(gottesdienst => {
        return {
            ...gottesdienst,
            technikBild: gottesdienst.Gottesdienst_User.filter(user => user.role === "TECHNIK_BILD").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            technikTon: gottesdienst.Gottesdienst_User.filter(user => user.role === "TECHNIK_TON").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            prediger: gottesdienst.Gottesdienst_User.filter(user => user.role === "PASTOR").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            moderator: gottesdienst.Gottesdienst_User.filter(user => user.role === "MODERATOR").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            kindertreff: gottesdienst.Gottesdienst_User.filter(user => user.role === "KINDERTREFF").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            kinderhute: gottesdienst.Gottesdienst_User.filter(user => user.role === "KINDERHUTTE").map(user => {
                return {value: user.user.name, id: user.user.id}
            }),
            musik: gottesdienst.Gottesdienst_User.filter(user => user.role === "MUSIK").map(user => {
                return {value: user.user.name, id: user.user.id}
            })
        }
    })

    const groupedGottesdienste = gottestdienste?.reduce((acc, gottesdienst) => {
        const year = new Date(gottesdienst.dateFrom).getFullYear().toString();

        const updatedAcc: {
            [year: string]: any[]
        } = acc;

        if (!updatedAcc[year]) {
            updatedAcc[year] = [];
        }
        updatedAcc[year].push(gottesdienst);
        return updatedAcc;
    }, {} as {
        [year: string]: any[]
    });


    const columns = [
        {
            name: "id",
            label: "ID",
            type: "hidden",
            toggle: false,
            disabled: true
        },
        {
            name: "dateFrom",
            label: "Datum von",
            type: "datetime",
            toggle: true,
            disabled: false
        },
        {
            name: "dateUntill",
            label: "Datum bis",
            type: "datetime",
            toggle: false,
            disabled: false
        },
        {
            name: "anlass",
            label: "Anlass",
            type: "text",
            toggle: true,
            disabled: false
        },
        {
            name: "kommentar",
            label: "Kommentar",
            type: "text",
            toggle: true,
            disabled: false
        },
        {
            name: "theme",
            label: "Thema",
            type: "text",
            toggle: true,
            disabled: false
        },

        {
            name: "textstelle",
            label: "Textstelle",
            type: "text",
            toggle: true,
            disabled: false
        },
        {
            name: "externerPastor",
            label: "Externer Prediger",
            type: "text",
            toggle: true,
            disabled: false
        },
        {
            name: "findetStatt",
            label: "Findet statt",
            type: "boolean",
            toggle: true,
            disabled: false
        },
        {
            name: "abendmahl",
            label: "Abendmahl",
            type: "boolean",
            toggle: true,
            disabled: false
        },
        {
            name: "prediger",
            label: "Prediger",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "PASTOR")),
            multiple: false,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "moderator",
            label: "Moderator",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "MODERATOR")),
            multiple: false,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "technikBild",
            label: "Technik Bild",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "TECHNIK_BILD")),
            multiple: false,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "technikTon",
            label: "Technik Ton",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "TECHNIK_TON")),
            multiple: false,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "musik",
            label: "Musik",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "MUSIK")),
            multiple: true,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "kindertreff",
            label: "Kindertreff",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "KINDERTREFF")),
            multiple: true,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "kinderhute",
            label: "Kinderhüte",
            type: "select",
            options: users?.filter(user => user.teams.some(team => team.name === "KINDERHUTTE")),
            multiple: true,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false

        },
        {
            name: "kontakt",
            label: "Kontakt",
            type: "text",
            toggle: true,
            disabled: false
        },
    ]
    let dropdown: string[] = []
    if (groupedGottesdienste) {
        dropdown = Object.keys(groupedGottesdienste).map((year) => year)
    }

    async function handleSave(formData: FormData) {
        "use server";
        const prisma = new PrismaClient()
        if (!formData.get("id")) {
            const dateUntill = new Date(formData.get("dateFrom") as string)
            dateUntill.setHours(dateUntill.getHours() + 3)
            await prisma.gottesdienst.create({
                data: {
                    dateFrom: new Date(formData.get("dateFrom") as string),
                    dateUntill: dateUntill.toISOString(),
                    anlass: formData.get("anlass") as string,
                    kommentar: formData.get("kommentar") as string,
                    thema: formData.get("theme") as string,
                    textstelle: formData.get("textstelle") as string,
                    externerPastor: formData.get("externerPastor") as string,
                    findetStatt: formData.get("findetStatt") === "on",
                    abendmahl: formData.get("abendmahl") === "on",
                    kontakt: formData.get("kontakt") as string,
                    locationId: locationId,
                    Gottesdienst_User: {
                        create: [
                            {
                                userId: formData.get("technikBild") as string,
                                role: "TECHNIK_BILD",
                            },
                            {
                                userId: formData.get("technikTon") as string,
                                role: "TECHNIK_TON"
                            },
                            {
                                userId: formData.get("prediger") as string,
                                role: "PASTOR"
                            },
                            {
                                userId: formData.get("moderator") as string,
                                role: "MODERATOR"
                            },
                            // @ts-ignore
                            ...(formData.getAll("kindertreff") as string[]).map(user => ({
                                userId: user,
                                role: "KINDERTREFF"
                            })),
                            // @ts-ignore
                            ...(formData.getAll("kinderhute") as string[]).map(user => ({
                                userId: user,
                                role: "KINDERHUTTE"
                            })),
                            // @ts-ignore
                            ...(formData.getAll("musik") as string[]).map(user => ({
                                userId: user,
                                role: "MUSIK"
                            }))
                        ]
                    }
                }
            })
        } else {
            // date from plus 3 hours and in iso string
            const dateUntill = new Date(formData.get("dateFrom") as string)
            dateUntill.setHours(dateUntill.getHours() + 3)
            await prisma.gottesdienst.update({
                where: {
                    id: formData.get("id") as string
                },
                data: {
                    dateFrom: new Date(formData.get("dateFrom") as string),
                    dateUntill: dateUntill.toISOString(),
                    anlass: formData.get("anlass") as string,
                    kommentar: formData.get("kommentar") as string,
                    thema: formData.get("theme") as string,
                    textstelle: formData.get("textstelle") as string,
                    externerPastor: formData.get("externerPastor") as string,
                    findetStatt: formData.get("findetStatt") === "on",
                    abendmahl: formData.get("abendmahl") === "on",
                    kontakt: formData.get("kontakt") as string,
                }
            })
            await prisma.gottesdienst_User.deleteMany({
                where: {
                    gottesdienstId: formData.get("id") as string
                }
            })

            await prisma.gottesdienst_User.createMany({
                data: [
                    {
                        userId: formData.get("technikBild") as string,
                        role: "TECHNIK_BILD",
                        gottesdienstId: formData.get("id") as string
                    },
                    {
                        userId: formData.get("technikTon") as string,
                        role: "TECHNIK_TON",
                        gottesdienstId: formData.get("id") as string
                    },
                    {
                        userId: formData.get("prediger") as string,
                        role: "PASTOR",
                        gottesdienstId: formData.get("id") as string
                    },
                    {
                        userId: formData.get("moderator") as string,
                        role: "MODERATOR",
                        gottesdienstId: formData.get("id") as string
                    },
                    // @ts-ignore
                    ...(formData.getAll("kindertreff") as string[]).map(user => ({
                        userId: user,
                        role: "KINDERTREFF",
                        gottesdienstId: formData.get("id") as string
                    })),
                    // @ts-ignore
                    ...(formData.getAll("kinderhute") as string[]).map(user => ({
                        userId: user,
                        role: "KINDERHUTTE",
                        gottesdienstId: formData.get("id") as string
                    })),
                    // @ts-ignore
                    ...(formData.getAll("musik") as string[]).map(user => ({
                        userId: user,
                        role: "MUSIK",
                        gottesdienstId: formData.get("id") as string
                    }))
                ]
            })
        }
        return revalidatePath(`/location/${locationId}/planer`)
    }

    async function handleDelete(item: any) {
        "use server";
        const prisma = new PrismaClient()
        await prisma.gottesdienst_User.deleteMany({
            where: {
                gottesdienstId: item.id
            }
        })

        await prisma.gottesdienst.delete({
            where: {
                id: item.id
            }
        })
        return revalidatePath(`/location/${locationId}/planer`)
    }

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <main
                className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
            >
                <CustomTable columns={columns} data={groupedGottesdienste} dropdown={dropdown} tableName={'planer'}
                             addButton={user_location_role != RelationRoleLocation.VIEWER} handleSave={handleSave}
                             editButton={user_location_role != RelationRoleLocation.VIEWER}
                             deleteButton={user_location_role != RelationRoleLocation.VIEWER}
                             handleDelete={handleDelete}
                             selectMenu={true}
                             exportButton={true}

                />
            </main>
        </LocationLayout>
    )
}

export default page;