import Card from "@/components/ui/card";
import {UserSession} from "@/lib/types";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import {authOptions} from "@/lib/authOptions";
import SingleValue from "@/components/ui/singleValue";

const Page = async () => {
    const session: UserSession | null = await getServerSession(authOptions)
    if (session === null) {
        redirect("/auth/login")
    }

    return (
        <div
            className={"grid items-center justify-start w-full h-full p-4 grid-cols-2 gap-4 min-h-screen grid-rows-[auto_1fr_1fr]"}
        >
            <h1
                className={"text-5xl mb-2 mt-6 font-bold text-center col-span-2"}
            >
                Account
            </h1>
            <Card>
                <div
                className={"grid gap-4 w-full h-full p-4 md:grid-cols-2 grid-cols-1 md:grid-rows-2"}
                >
                    <h2
                        className={"text-lg font-bold col-span-2 text-center"}
                    >
                        Account Information
                    </h2>
                    <SingleValue value={session.user.email} label={"Email"} style={{value: "ml-4", label: 'ml-4'}}/>
                    <SingleValue value={session.user.name} label={"Name"} style={{value: "ml-4", label: 'ml-4'}}/>
                    <SingleValue value={session.user.locations.length.toString()} label={"Standorte"} style={{value: "ml-4", label: 'ml-4'}}/>
                    <SingleValue value={session.user.role} label={"Rolle"} style={{value: "ml-4", label: 'ml-4'}}/>
                </div>
            </Card>
        </div>
    )
}

export default Page;