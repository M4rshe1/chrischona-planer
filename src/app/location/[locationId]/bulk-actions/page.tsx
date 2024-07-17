import LocationLayout from "@/components/locationLayout";
import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {notFound, redirect} from "next/navigation";
import {PrismaClient} from "@prisma/client";
import BulkactionPage from "@/pages/bulkactionPage";


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
        const technik_exclude = [formData.get("technik_bild_excluded")].flat(Infinity)
        const technik_ton = (formData.get("technik_ton") === "on")
        const technik_ton_exclude = [formData.get("technik_ton_excluded")].flat(Infinity)
        const kindertreff = (formData.get("kindertreff") === "on")
        const kindertreff_exclude = [formData.get("kindertreff_excluded")].flat(Infinity)
        const kindertreff_anzahl = parseInt(formData.get("kindertreff_anzahl") as string ?? 1)
        const kinderhute = (formData.get("kinderhute") === "on")
        const kinderhute_exclude = [formData.get("kinderhute_excluded")].flat(Infinity)
        const kinderhute_anzahl = parseInt(formData.get("kinderhute_anzahl") as string ?? 1)
        const moderator = (formData.get("moderator") === "on")
        const moderator_exclude = [formData.get("moderator_excluded")].flat(Infinity)
        const start = formData.get("start") as string
        const end = formData.get("end") as string
        const createSunday = (formData.get("createSunday") === "on")
        const abendmahl = (formData.get("abendmahl") === "on")
        const overrideOld = (formData.get("overrideOld") === "on")

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