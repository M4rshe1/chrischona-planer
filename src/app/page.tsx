import {getServerSession} from "next-auth";
import {UserSession} from "@/app/api/auth/[...nextauth]/route";
import {PrismaClient} from "@prisma/client";
import Link from "next/link";
import {LoginButton, RegisterButton} from "@/lib/auth";

const prisma = new PrismaClient()


const Home = async () => {
    const session: UserSession | null = await getServerSession()
    if (!session) {
        return (
            <main className="flex h-full flex-col items-center justify-between p-24">
                <div>
                    <h1 className="text-5xl font-bold text-center">Willkommen bei Chrischona Planer</h1>
                    <p className="text-lg text-center">Erstelle und verwalte deine Anlässe und Absenzen</p>
                    <div
                        className="flex justify-center gap-4 mt-8"
                    >
                        <LoginButton className={"btn-primary"}/>
                        <RegisterButton className={"btn-neutral"}/>
                    </div>
                </div>
            </main>
        );
    }
    let Locations
    let Events
    try {
        Locations = await prisma.user.findUnique({
            where: {
                email: session.user.email
            },
            select: {
                locations: {
                    select: {
                        location: true,
                        relation: true
                    },
                },
            }
        });

        Events = await prisma.gottesdienst_User.findMany({
            where: {
                AND: [
                    {
                        userId: session.user.id
                    },
                    {
                        gottesdienst: {
                            AND: [
                                {
                                    date: {
                                        gte: new Date()
                                    }
                                },
                                {
                                    locationId: {
                                        in: Locations?.locations.map((location) => location.location.id)
                                    }
                                }
                            ]
                        }
                    }

                ]
            },
            include: {
                gottesdienst: true
            }
        });
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }


    return (
        <main className="flex h-full flex-col items-center justify-start py-16 w-[90%] grow">
            <div>
                <h1 className="text-5xl mb-2 font-bold text-center">Hallo {session.user.name}</h1>
                <p className="text-lg text-center">Willkommen zurück bei Chrischona Planer</p>
            </div>
            <div
                className="flex flex-col items-start gap-2 mt-8 w-full px-4 py-8"
            >
                <h1 className="text-4xl font-bold text-center">Deine Standorte</h1>
                <div
                    className={"grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-center w-full mt-4"}
                >
                    {
                        Locations?.locations.map((location, index) => {
                            return (
                                <Link href={'/location/' + location.location.id} key={index}
                                      className="flex justify-between mt-4 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full">
                                    <div>
                                        <h2 className="text-xl font-bold">{location.location.name}</h2>
                                        <p>{location.location.address}</p>
                                        <p
                                            className={"text-sm text-neutral-500 font-semibold"}
                                        >{location.relation}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
            <div
                className="flex flex-col items-start gap-2 mt-8 w-full px-4 py-8"
            >
                <h1 className="text-4xl font-bold text-center">Deine Events</h1>
                {
                    // @ts-ignore
                    Events?.length > 0 ?
                        (
                            <div
                            className={"grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-center w-full mt-4"}
                        >
                            {

                                Events?.map((event, index) => {
                                    return (
                                        <Link
                                            href={'/location/' + event.gottesdienst.locationId + '/event/' + event.gottesdienst.id}
                                            key={index}
                                            className="flex justify-between mt-4 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full">
                                            <div>
                                                <h2 className="text-xl font-bold">{event.gottesdienst.anlass}</h2>
                                                <p>{event.gottesdienst.date.toString()}</p>
                                            </div>
                                        </Link>
                                    )
                                })
                            }
                        </div>
                        ) : <p className="text-lg text-center">Du hast akktuell keine anstehenden Gottesdienste</p>
                }
            </div>
        </main>
    );
}

export default Home;


