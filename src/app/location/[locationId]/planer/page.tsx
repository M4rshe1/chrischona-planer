import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {EditableTableColumn, UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleGottesdienst, RelationRoleLocation} from "@prisma/client";
import {revalidatePath} from "next/cache";
import Loading from "@/app/loading";
import {Suspense} from "react";
import {fas} from "@fortawesome/free-solid-svg-icons";
import EditableTable from "@/components/editableTable";


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
            TECHNIK_BILD: gottesdienst.Gottesdienst_User.filter(user => user.role === "TECHNIK_BILD").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            TECHNIK_TON: gottesdienst.Gottesdienst_User.filter(user => user.role === "TECHNIK_TON").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            PREDIGER: gottesdienst.Gottesdienst_User.filter(user => user.role === "PREDIGER").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            MODERATOR: gottesdienst.Gottesdienst_User.filter(user => user.role === "MODERATOR").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            KINDERTREFF: gottesdienst.Gottesdienst_User.filter(user => user.role === "KINDERTREFF").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            KINDERHUTE: gottesdienst.Gottesdienst_User.filter(user => user.role === "KINDERHUTE").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            MUSIK: gottesdienst.Gottesdienst_User.filter(user => user.role === "MUSIK").map(user => {
                return {label: user.user.name, value: user.user.id}
            }),
            BEGRUSSUNG: gottesdienst.Gottesdienst_User.filter(user => user.role === "BEGRUSSUNG").map(user => {
                return {label: user.user.name, value: user.user.id}
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

    const columns: EditableTableColumn[] = [
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
        //     disabled: true
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
            name: "thema",
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
            type: "checkbox",
            toggle: true,
            disabled: false
        },
        {
            name: "abendmahl",
            label: "Abendmahl",
            type: "checkbox",
            toggle: true,
            disabled: false
        },
        {
            name: "PREDIGER",
            label: "Prediger",
            type: "select",
            options: teams?.find(team => team.name === "PREDIGER")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "MODERATOR",
            label: "Morderator",
            type: "select",
            options: teams?.find(team => team.name === "MODERATOR")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "TECHNIK_BILD",
            label: "Technik Bild",
            type: "select",
            options: teams?.find(team => team.name === "TECHNIK_BILD")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "TECHNIK_TON",
            label: "Technik Ton",
            type: "select",
            options: teams?.find(team => team.name === "TECHNIK_TON")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "MUSIK",
            label: "Musik",
            type: "multiSelect",
            options: teams?.find(team => team.name === "MUSIK")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "BEGRUSSUNG",
            label: "Begrüssung",
            type: "multiSelect",
            options: teams?.find(team => team.name === "BEGRUSSUNG")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "KINDERTREFF",
            label: "Kindertreff",
            type: "multiSelect",
            options: teams?.find(team => team.name === "KINDERTREFF")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
            toggle: true,
            disabled: false
        },
        {
            name: "KINDERHUTE",
            label: "Kinderhüte",
            type: "multiSelect",
            options: teams?.find(team => team.name === "KINDERHUTE")?.users.map(
                user => {
                    return {
                        label: user.name,
                        value: user.id
                    }
                }
            ) || [],
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

    async function handleSave(value: any, row: any, name: string) {
        "use server";
        let connections = null
        // if (row[name] === value) {
        //     return
        // }

        if (['TECHNIK_BILD', 'TECHNIK_TON', 'PREDIGER', 'MODERATOR', 'MUSIK', 'BEGRUSSUNG', 'KINDERTREFF', 'KINDERHUTE'].includes(name)) {
            if (!value) {
                return
            } else if (typeof value === 'string') {
                value = [ value ]
            }

            connections = true
        }

        const prisma = new PrismaClient()
        if (connections) {
            try {
                await prisma.gottesdienst_User.deleteMany({
                    where: {
                        gottesdienstId: row.id,
                        role: name as RelationRoleGottesdienst
                    }
                })
            } catch (e) {
                console.error(e)
            }

            await prisma.gottesdienst_User.createMany({
                data: value?.map((id: string) => {
                    return {
                        userId: id,
                        gottesdienstId: row.id,
                        role: name as RelationRoleGottesdienst
                    }
                })
            })
        } else if (['dateFrom', 'dateUntill'].includes(name))  {
            value = new Date(value)
            try {
                await prisma.gottesdienst.update({
                    where: {
                        id: row.id
                    },
                    data: {
                        dateFrom: value,
                        dateUntill: value
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        } else
        {
            try {
                await prisma.gottesdienst.update({
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
                await prisma.$disconnect()
            }
        }
    }


    async function handleOpenZeitplaner(item: any) {
        "use server"
        redirect(`/location/${locationId}/planer/${item.id}`)
    }

    async function handleDelete(item: any) {
        "use server";
        const prisma = new PrismaClient()

        try {
            await prisma.gottesdienst_User.deleteMany({
                where: {
                    gottesdienstId: item.id
                }
            })

            await prisma.zeitplan.deleteMany({
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

    async function createHandler(dontRemove: any) {
        "use server";

        const prisma = new PrismaClient()

        try {
            await prisma.gottesdienst.create({
                data: {
                    location: {
                        connect: {
                            id: locationId
                        }
                    }
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }

        return revalidatePath(`/location/${locationId}/planer`)
    }


    const actions = [
        {
            handler: handleOpenZeitplaner,
            tooltip: "Zeitplaner öffnen",
            icon: fas.faRectangleList,
            style: "btn-neutral"
        }
    ]

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <Suspense fallback={<Loading/>}>
                <main
                    className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full"}
                >
                    <EditableTable data={groupedGottesdienste}
                                   columns={columns}
                                   rowActions={actions}
                                   saveHandler={handleSave} deleteHandler={handleDelete} grouped={true}
                                   allowCreate={user_location_role != RelationRoleLocation.VIEWER}
                                   allowDelete={user_location_role != RelationRoleLocation.VIEWER}
                                   allowFullscreen={true}
                                   allowExport={true}
                                   allowEdit={user_location_role != RelationRoleLocation.VIEWER}
                                   tableName={"planer"}
                                   createHandler={createHandler}
                    />

                </main>
            </Suspense>
        </LocationLayout>
    )
}

export default page;