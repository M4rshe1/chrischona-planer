import Link from "next/link";
import {UserSession} from "@/app/api/auth/[...nextauth]/route";
import {RelationRoleLocation} from "@prisma/client";
import {headers} from "next/headers";
import {log} from "node:util";

const LocationLayout = ({children, location, locationId, session, user_location_role}: {
    children: any,
    location: any,
    locationId: string,
    session: UserSession,
    user_location_role: RelationRoleLocation
}) => {
    const header = headers()
    const current_path = header.get("referer")?.split("/")?.pop()
    console.log(locationId === current_path)
    console.log(current_path)
    return (
        <div
            className={"w-full h-full grid grid-cols-[auto_1fr] items-center justify-start grow"}
        >
            <aside
                className={"flex flex-col items-center w-full h-full bg-base-200 text-base-content border-t-2 border-base-300"}
            >
                <h1
                    className={"w-full font-bold p-4"}
                >{location?.name}</h1>
                <div
                    className={"flex flex-col gap-4 w-full border-t-2 border-base-300 text-lg"}
                >
                    <ul
                        className={"menu menu-md"}
                    >
                        <li><Link
                            href={`/location/${locationId}`}
                            className={"text-semibold text-lg " + current_path === locationId ? "active" : ""}
                        >
                            Dashboard
                        </Link></li>
                        <li><Link
                            href={`/location/${locationId}/planer`}
                            className={"text-semibold text-lg " + current_path === current_path + "planer" ? "active" : ""}
                        >
                            Planer
                        </Link></li>
                        {
                            (["OWNER", "MANAGER"].includes(user_location_role as string) || session.user.role === "ADMIN") &&
                            <>
                                <li><Link
                                    href={`/location/${locationId}/access`}
                                    className={"text-semibold text-lg " + current_path === current_path + "access" ? "active" : ""}
                                >
                                    Zugriff & Codes
                                </Link></li>
                                <li><Link
                                    href={`/location/${locationId}/team`}
                                    className={"text-semibold text-lg " + current_path === current_path + "team" ? "active" : ""}
                                >
                                    Team
                                </Link></li>
                            </>
                        }
                    </ul>
                </div>
            </aside>
            {children}
        </div>
    )
}

export default LocationLayout;