import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {TeamFilterType, UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient, RelationRoleGottesdienst} from "@prisma/client";
import BulkactionPage from "@/pages/bulkactionPage";
import {doRangesOverlap} from "@/lib/dateFunctions";


const page = async ({params}: { params: { locationId: string } }) => {
    const prisma = new PrismaClient()
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }


    const locationId = params.locationId;
    let Teams = null;
    let location = null;
    try {
        location = await prisma.location.findUnique({
            where: {
                id: locationId
            },
            include: {
                Users: true
            }

        })

        Teams = await prisma.team.findMany({
            where: {
                locationId: locationId
            },
            select: {
                id: true,
                name: true,
                users: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        id: true
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

    async function handleBulkAction(formData: FormData) {
        "use server"
        const technik_bild = (formData.get("technik_bild") === "on")
        const technik_exclude = [formData.get("technik_bild_excluded")].flat(Infinity) as string[]
        const technik_ton = (formData.get("technik_ton") === "on")
        const technik_ton_exclude = [formData.get("technik_ton_excluded")].flat(Infinity) as string[]
        const kindertreff = (formData.get("kindertreff") === "on")
        const kindertreff_exclude = [formData.get("kindertreff_excluded")].flat(Infinity) as string[]
        const kindertreff_anzahl = parseInt(formData.get("kindertreff_anzahl") as string ?? 1)
        const kinderhute = (formData.get("kinderhute") === "on")
        const kinderhute_exclude = [formData.get("kinderhute_excluded")].flat(Infinity) as string[]
        const kinderhute_anzahl = parseInt(formData.get("kinderhute_anzahl") as string ?? 1)
        const moderator = (formData.get("moderator") === "on")
        const moderator_exclude = [formData.get("moderator_excluded")].flat(Infinity) as string[]
        const start = formData.get("start") as string
        const end = formData.get("end") as string
        const createSunday = (formData.get("createSunday") === "on")
        const abendmahl = (formData.get("abendmahl") === "on")
        const overrideOld = (formData.get("overrideOld") === "on")

        if (new Date(start) > new Date(end)) {
            return redirect("/location/" + locationId + "/bulk-actions?error=invalid_dates?code=400")
        }

        const nextSunday = new Date(start)
        nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()))
        const lastSunday = new Date(end)
        lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay())

        const dates = []
        let date = new Date(nextSunday)
        while (date <= lastSunday) {
            dates.push(new Date(date))
            date.setDate(date.getDate() + 7)
        }

        const prisma = new PrismaClient()
        try {
            let teams = await prisma.team.findMany({
                where: {locationId},
                select: {
                    id: true,
                    name: true,
                    users: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    abwesenheiten: {
                                        select: {dateFrom: true, dateTo: true},
                                        where: {
                                            OR: [
                                                {
                                                    dateFrom: {lte: new Date(end)},
                                                    dateTo: {gte: new Date(start)},
                                                },
                                                {
                                                    dateFrom: {gte: new Date(start)},
                                                    dateTo: {lte: new Date(end)},
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }).then((teams) => {
                return teams.map((team) => {
                    return {
                        id: team.id,
                        name: team.name,
                        users: team.users.map((user) => {
                            return {
                                id: user.user.id,
                                absences: user.user.abwesenheiten.flat(Infinity).map((absence) => {
                                    return {
                                        dateFrom: absence.dateFrom,
                                        dateTo: absence.dateTo,
                                    }
                                })
                            }
                        })
                    }
                })
            })

            const teamFilters: TeamFilterType[] = [
                {
                    key: "technik_bild",
                    name: "TECHNIK_BILD",
                    exclude: technik_exclude,
                    queue: [],
                    behind: 0,
                    selected: technik_bild,
                    count: 1
                },
                {
                    key: "technik_ton",
                    name: "TECHNIK_TON",
                    exclude: technik_ton_exclude,
                    queue: [],
                    behind: 0,
                    selected: technik_ton,
                    count: 1
                },
                {
                    key: "kindertreff",
                    name: "KINDERTREFF",
                    exclude: kindertreff_exclude,
                    queue: [],
                    behind: 0,
                    selected: kindertreff,
                    count: kindertreff_anzahl
                },
                {
                    key: "kinderhute",
                    name: "KINDERHUTE",
                    exclude: kinderhute_exclude,
                    queue: [],
                    behind: 0,
                    selected: kinderhute,
                    count: kinderhute_anzahl
                },
                {
                    key: "moderator",
                    name: "MODERATOR",
                    exclude: moderator_exclude,
                    queue: [],
                    behind: 0,
                    selected: moderator,
                    count: 1
                },
            ];

            teams = teams.map((team) => {
                // @ts-ignore
                const filter = teamFilters.find(f => f.name === team.name);
                return filter ? {...team, users: team.users.filter(user => !filter.exclude.includes(user.id))} : team;
            });

            teams = teams.filter((team) => (team.users.length > 0 && ((teamFilters?.find((filter) => filter.name === team.name) || {}).selected)));

            const getUserForJob = (job: RelationRoleGottesdienst, date: Date, position: number) => {
                const team = teams.find((team) => team.name === job);
                const teamFilter = teamFilters.find((filter) => filter.name === job);
                if (!team || !teamFilter) return null;
                let user = null;
                while (team.users.length > 0 && teamFilter.queue.length !== team.users.length) {
                    const index = (position + team.users.length) % teamFilter.queue.length;
                    const userIndex = team.users[index] as any;
                    const userAbsences = userIndex?.absences.filter((absence: any) => doRangesOverlap(absence.dateFrom, absence.dateTo, date, date));
                    if (!!userAbsences?.length) {
                        // @ts-ignore
                        teamFilter.queue.push(index);
                        teamFilter.behind++;
                    } else {
                        if (teamFilter.behind > 0) {
                            teamFilter.behind--;
                            user = teamFilter.queue.shift();
                            break
                        } else {
                            user = userIndex;
                            break;
                        }
                    }
                }
                if (!user) return null;
                return {
                    userId: user?.id,
                    role: job
                };
            }


            dates.map(async (date: Date, index: number) => {
                const isFirstSundayOfMonth = date.getDate() <= 7;

                const gottesdienst = await prisma.gottesdienst.findMany({
                    where: {
                        dateFrom: {
                            equals: date.toISOString()
                        },
                    }
                })

                if (!!gottesdienst.length && overrideOld) {
                    await prisma.gottesdienst.deleteMany({
                        where: {
                            id: {
                                equals: gottesdienst[0].id
                            }
                        },
                    })

                    await prisma.gottesdienst_User.deleteMany({
                        where: {
                            gottesdienstId: {
                                equals: gottesdienst[0].id
                            }
                        }
                    })

                    await prisma.zeitplan.deleteMany({
                        where: {
                            gottesdienstId: {
                                equals: gottesdienst[0].id
                            }
                        }
                    })
                }
                if ((!gottesdienst.length && createSunday) || (!!gottesdienst.length && overrideOld)) {
                    const gd = await prisma.gottesdienst.create({
                        data: {
                            locationId,
                            dateFrom: date.toISOString(),
                            dateUntill: date.toISOString(),
                            anlass: "Gottesdienst",
                            abendmahl: isFirstSundayOfMonth && abendmahl,
                        }
                    });
                    const usersForJob = teams.map(team => getUserForJob(team.name, date, index)).filter((user) => !!user);
                    console.log(usersForJob)
                    await prisma.gottesdienst_User.createMany({
                        data: usersForJob.map(({userId, role}) => ({
                            userId,
                            gottesdienstId: gd.id,
                            role
                        }))
                    });
                } else if (gottesdienst.length) {
                    const usersForJob = teams.flatMap(team => getUserForJob(team.name, date, index)).filter((user) => !!user);
                    await prisma.gottesdienst.update({
                        where: {
                            id: gottesdienst[0].id
                        },
                        data: {
                            abendmahl: (isFirstSundayOfMonth && abendmahl) ?? false,
                        }
                    })
                    await prisma.gottesdienst_User.deleteMany({
                        where: {
                            gottesdienstId: {
                                equals: gottesdienst[0].id
                            },
                            role: {
                                in: usersForJob.map((user) => user.role).reduce((acc: RelationRoleGottesdienst[], val) => acc.includes(val) ? acc : acc.concat(val), [])
                            }
                        }
                    })
                    await prisma.gottesdienst_User.createMany({
                        data: usersForJob.map(({userId, role}) => ({
                            userId,
                            gottesdienstId: gottesdienst[0].id,
                            role
                        }))
                    });
                }
            })
        } catch
            (e) {
            console.error(e)
            return redirect("/location/" + locationId + "/bulk-actions?state=error&description=internal_error?code=500")
        } finally {
            await prisma.$disconnect()
        }
        return redirect("/location/" + locationId + "/bulk-actions?state=done")
    }

    const user_location_role = location.Users.find((user) => user.userId === session.user.id)?.relation ?? "VIEWER"

    return (
        <LocationLayout location={location} locationId={locationId} session={session}
                        user_location_role={user_location_role}>
            <BulkactionPage options={Teams} handler={handleBulkAction}/>
        </LocationLayout>
    )
}


export default page;