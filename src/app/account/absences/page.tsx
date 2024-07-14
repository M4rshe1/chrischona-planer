import {authOptions} from '@/lib/authOptions';
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {PrismaClient} from "@prisma/client";
import {revalidatePath} from "next/cache";
import EditableTable from "@/components/editableTable";


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
            type: "text",
            toggle: false,
            disabled: true
        },
        {
            name: "dateFrom",
            label: "Datum Ab",
            type: "date",
            toggle: true,
            disabled: false
        },
        {
            name: "dateTo",
            label: "Datum Bis",
            type: "date",
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

    async function handleSave(values: any, item: any, name: string) {
        "use server"
        const prisma = new PrismaClient()

        try {
            await prisma.abwesenheit.update({
                where: {
                    id: item.id
                },
                data: {
                    [name]: values
                }
            })
        } catch (e) {
            console.error(e)
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

    async function handleCreate() {
        "use server"
        const session: UserSession | null = await getServerSession(authOptions)
        if (!session) {
            redirect("/auth/login")
        }
        const prisma = new PrismaClient()

        try {
            await prisma.abwesenheit.create({
                data: {
                    userId: session.user.id,
                    dateFrom: new Date(),
                    dateTo: new Date(),
                    reason: ""
                }
            })
        } catch (e) {
            console.error(e)
        } finally {
            prisma.$disconnect()
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
            <EditableTable
                grouped={true}
                data={groupedAbsences} saveHandler={handleSave} createHandler={handleCreate}
                deleteHandler={handleDelete} columns={columns} allowEdit={true} allowCreate={true}
                allowDelete={true} allowFullscreen={true} tableName={'user_absences'} allowExport={false}/>
        </main>
    )
}

export default page;