import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleLocation} from "@prisma/client";
import CustomTable from "@/components/customTable";
import {revalidatePath} from "next/cache";
import Loading from "@/app/loading";
import {Suspense} from "react";
import {fas} from "@fortawesome/free-solid-svg-icons";


const prisma = new PrismaClient()

const page = async ({params}: { params: { locationId: string } }) => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let location = null;
    let gottestdienste = null;
    let teams = null;
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

        teams = await prisma.team.findMany({
            where: {
                locationId: locationId
            },
            select: {
                name: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
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

    teams = teams?.map((team) => {
        return {
            ...team,
            users: team.users.map((user) => user.user)
        }
    })


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
            prediger: gottesdienst.Gottesdienst_User.filter(user => user.role === "PREDIGER").map(user => {
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
            }),
            begrussung: gottesdienst.Gottesdienst_User.filter(user => user.role === "BEGRUSSUNG").map(user => {
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
            label: "Datum",
            type: "date",
            toggle: true,
            disabled: false
        },
        // {
        //     name: "dateUntill",
        //     label: "Datum bis",
        //     type: "date",
        //     toggle: false,
        //     disabled: false
        // },
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
            name: "externerPrediger",
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
            options: teams?.find(team => team.name === "PREDIGER")?.users || [],
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
            options: teams?.find(team => team.name === "MODERATOR")?.users || [],
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
            options: teams?.find(team => team.name === "TECHNIK_BILD")?.users || [],
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
            options: teams?.find(team => team.name === "TECHNIK_TON")?.users || [],
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
            options: teams?.find(team => team.name === "MUSIK")?.users || [],
            multiple: true,
            keys: {
                value: "name",
                id: "id"
            },
            toggle: true,
            disabled: false
        },
        {
            name: "begrussung",
            label: "Begrüssung",
            type: "select",
            options: teams?.find(team => team.name === "BEGRUSSUNG")?.users || [],
            multiple: false,
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
            options: teams?.find(team => team.name === "KINDERTREFF")?.users || [],
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
            options: teams?.find(team => team.name === "KINDERHUTTE")?.users || [],
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
        {
            name: "youtubeLink",
            label: "Stream Link",
            type: "link",
            toggle: true,
            disabled: false
        },
    ]
    let dropdown: string[] = []
    if (groupedGottesdienste) {
        dropdown = Object.keys(groupedGottesdienste)
    }

    async function handleSave(formData: FormData) {
        "use server";
        try {
            const toCheck = [
                {name: "TECHNIK_BILD", input: "technikBild"},
                {name: "TECHNIK_TON", input: "technikTon"},
                {name: "PREDIGER", input: "prediger"},
                {name: "MODERATOR", input: "moderator"},
                {name: "BEGRUSSUNG", input: "begrussung"}
            ]
            const toCreate: any[] = []


            const dateFromForm = formData.get("dateFrom") as string
            let dateFrom
            let dateUntill
            if (dateFromForm === "") {
                dateFrom = new Date()
                dateUntill = new Date()
            } else {
                dateFrom = new Date(dateFromForm)
                dateUntill = new Date(dateFromForm)
                dateUntill.setHours(dateUntill.getHours() + 3)
            }


            const prisma = new PrismaClient()
            if (!formData.get("id")) {
                toCheck.map(role => {
                    if (formData.get(role.input) !== "none") {
                        toCreate.push(({
                            userId: formData.get(role.input) as string,
                            role: role.name,
                        }))
                    }
                })

                await prisma.gottesdienst.create({
                    data: {
                        dateFrom: dateFrom,
                        dateUntill: dateUntill,
                        anlass: formData.get("anlass") as string,
                        kommentar: formData.get("kommentar") as string,
                        thema: formData.get("theme") as string,
                        textstelle: formData.get("textstelle") as string,
                        externerPrediger: formData.get("externerPrediger") as string,
                        findetStatt: formData.get("findetStatt") === "on",
                        abendmahl: formData.get("abendmahl") === "on",
                        kontakt: formData.get("kontakt") as string,
                        youtubeLink: formData.get("youtubeLink") as string,
                        locationId: locationId,
                        Gottesdienst_User: {
                            create: [
                                ...toCreate,
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
                toCheck.map(role => {
                    if (formData.get(role.input) !== "none") {
                        toCreate.push(({
                            userId: formData.get(role.input) as string,
                            role: role.name,
                            gottesdienstId: formData.get("id") as string
                        }))
                    }
                })
                await prisma.gottesdienst.update({
                    where: {
                        id: formData.get("id") as string
                    },
                    data: {
                        dateFrom: dateFrom,
                        dateUntill: dateUntill,
                        anlass: formData.get("anlass") as string,
                        kommentar: formData.get("kommentar") as string,
                        thema: formData.get("theme") as string,
                        textstelle: formData.get("textstelle") as string,
                        externerPrediger: formData.get("externerPrediger") as string,
                        findetStatt: formData.get("findetStatt") === "on",
                        abendmahl: formData.get("abendmahl") === "on",
                        kontakt: formData.get("kontakt") as string,
                        youtubeLink: formData.get("youtubeLink") as string,
                    }
                })
                await prisma.gottesdienst_User.deleteMany({
                    where: {
                        gottesdienstId: formData.get("id") as string
                    }
                })

                await prisma.gottesdienst_User.createMany({
                    data: [
                        ...toCreate,
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
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
    }

    async function handleOpenZeitplaner(item: any) {
        "use server"
        redirect(`/location/${locationId}/planer/${item.id}`)
    }

    const actions = [
        {
            handler: handleOpenZeitplaner,
            tooltip: "Zeitplaner öffnen",
            icon: fas.faRectangleList,
            style: "btn-neutral"
        }
    ]


    async function handleDelete(item: any) {
        "use server";
        const prisma = new PrismaClient()
        try {

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
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/location/${locationId}/planer`)
    }

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
            <main
                className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
            >
                <CustomTable columns={columns} data={groupedGottesdienste} dropdown={dropdown} tableName={'planer'}
                             addButton={user_location_role != RelationRoleLocation.VIEWER}
                             editButton={user_location_role != RelationRoleLocation.VIEWER}
                             deleteButton={user_location_role != RelationRoleLocation.VIEWER}
                             handleSave={handleSave}
                             handleDelete={handleDelete}
                             selectMenu={true}
                             exportButton={true}
                             fullscreenButton={true}
                             actions={actions}
                />
            </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;