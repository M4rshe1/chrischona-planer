import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import AccessRequestForm from "@/components/accessRequestFormular";
import {revalidatePath} from "next/cache";
import Link from "next/link";
import db from "@/lib/db";


const Page = async ({params}: { params: { locationId: string } }) => {
    const locationId = params.locationId;
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    if (session.user.locations.map((location) => location.id).includes(locationId)) {
        redirect(`/location/${locationId}`)
    }

    let requests = null;
    try {
        requests = await db.access_request.findMany({
            where: {
                userId: session?.user.id,
                locationId: locationId,
                approved: false
            }
        })
    } catch (e) {
        console.error(e)
    } finally {

    }

    if (requests) {
        return (
            <div
                className={"w-full h-full flex items-center justify-start grow"}
            >
                <main
                    className={"flex flex-col items-center justify-center w-full h-full p-4"}
                >
                    <h1
                        className={'text-2xl text-center'}
                    >Du hast Zugriff für diese seite angefordert.<br/> Bitte warte bis diese bestätigt wurde
                    </h1>
                    <Link href={"/"}
                          className={"btn-primary btn mt-4"}
                    >
                        Home
                    </Link>
                </main>
            </div>
        )
    }

    async function requestAccess(formData: FormData) {
        "use server";
        try {
            const request = await db.access_request.create({
                data: {
                    user: {connect: {id: session?.user.id}},
                    location: {connect: {id: locationId}},
                },
            })
        } catch (e) {
            console.error(e)
        } finally {

        }
        return revalidatePath("/request/access/" + locationId)
    }

    return (
        <div
            className={"w-full h-full flex items-center justify-start grow"}
        >
            <main
                className={"flex items-center justify-center w-full h-full p-4"}
            >
                <AccessRequestForm location={locationId} formAction={requestAccess}/>
            </main>
        </div>
    );

}

export default Page;