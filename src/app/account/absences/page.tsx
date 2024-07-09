import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {PrismaClient} from "@prisma/client";
import {revalidatePath} from "next/cache";
import CustomTable from "@/components/customTable";


const prisma = new PrismaClient()

const page = async () => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    let absences = null;
    try {
        absences = await prisma.abwesenheit.findMany({
            where: {
                userId: session.user.id
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }


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
            label: "Datum Ab",
            type: "datetime",
            toggle: true,
            disabled: false
        },
        {
            name: "dateTo",
            label: "Datum Bis",
            type: "datetime",
            toggle: true,
            disabled: false,
        },
        {
            name: "reason",
            label: "Grund",
            type: "textarea",
            toggle: true,
            disabled: true,
        },
    ]

    async function handleSave(formData: FormData) {
        "use server"
        const session: UserSession | null = await getServerSession(authOptions)
        if (session === null) {
            redirect("/auth/login")
        }

        const prisma = new PrismaClient()
        let dateFromForm = formData.get("dateFrom") as string
        let dateToForm = formData.get("dateTo") as string
        let dateFrom
        let dateTo
        if (!dateFromForm) {
            dateFrom = new Date().toISOString()
        } else {
            dateFrom = new Date(dateFromForm).toISOString()
        }

        if (!dateToForm) {
            dateTo = new Date().toISOString()
        } else {
            dateTo = new Date(dateToForm).toISOString()
        }

        if (!formData.get("id")) {
            try {
                await prisma.abwesenheit.create({
                    data: {
                        userId: session.user.id,
                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        reason: formData.get("reason") as string
                    }
                })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        } else {
            try {
                await prisma.abwesenheit.update({
                    where: {
                        id: formData.get("id") as string
                    },
                    data: {
                        dateFrom: dateFrom,
                        dateTo: dateTo,
                        reason: formData.get("reason") as string
                }
            })
            } catch (e) {
                console.error(e)
            } finally {
                await prisma.$disconnect()
            }
        }
        return revalidatePath(`/account/absences`)
    }

    async function handleDelete(item: any) {
        "use server"
        const prisma = new PrismaClient()
        try {
            await prisma.abwesenheit.delete({
                where: {
                    id: item.id
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            await prisma.$disconnect()
        }
        return revalidatePath(`/account/absences`)
    }

    let groupedAbsences = absences?.reduce((acc, absence) => {
        const year = new Date(absence.dateFrom).getFullYear().toString();

        const updatedAcc: {
            [year: string]: any[]
        } = acc;

        if (!updatedAcc[year]) {
            updatedAcc[year] = [];
        }
        updatedAcc[year].push(absence);
        return updatedAcc;
    }, {} as {
        [year: string]: any[]
    });

    if (!groupedAbsences) {
        groupedAbsences = {}
    }


    const dropdown = Object.keys(groupedAbsences)


    return (

        <main
            className={"p-4 grid grid-cols-1 gap-4 w-full items-center justify-start h-full"}
        >
            <div>
                <h1
                    className={"text-5xl mb-2 mt-6 font-bold text-center"}
                >
                    Abwesenheiten
                </h1>
            </div>


            <CustomTable columns={columns} data={groupedAbsences} dropdown={dropdown} tableName={'user_absences'}
                         addButton={true}
                         editButton={true}
                         deleteButton={true}
                         handleDelete={handleDelete}
                         handleSave={handleSave}
                         selectMenu={true}
                         fullscreenButton={true}
            />
        </main>
    )
}

export default page;