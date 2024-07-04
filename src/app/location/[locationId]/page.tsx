import { PrismaClient } from '@prisma/client'
import Link from "next/link";


const prisma = new PrismaClient()

const LocationPage = async ({params}: { params: { locationId: string } }) => {
    const locationId = params.locationId;
    let location = null;
    try {
         location = await prisma.location.findUnique({
            where: {
                id: locationId
            }
        })

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }


    return (
        <div
        className={"w-full h-full grid grid-cols-[auto_1fr] items-center justify-start grow"}
        >
            <aside
                className={"flex flex-col items-center w-full h-full bg-base-200 text-base-content border-r border-base-300"}
            >
                <h1
                className={"w-full font-bold p-4"}
                >{location?.name}</h1>
            </aside>
            <main
            className={"grid items-center justify-start w-full h-full p-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 lg:grid-rows-3"}
            >
                <Link href={`/location/${locationId}/edit`}
                      className="flex justify-between mt-4 bg-base-200 rounded-box p-4 border-neutral border-2 hover:shadow-lg h-full"
                >
                    <h1
                    className={"font-bold text-center"}
                    >Standort bearbeiten</h1>
                </Link>
            </main>
        </div>
    );
}

export default LocationPage;