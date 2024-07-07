"use client";

import Link from "next/link";
import {UserSession} from "@/app/api/auth/[...nextauth]/route";
import {RelationRoleLocation} from "@prisma/client";
import {usePathname} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";


const LocationLayout = ({children, location, locationId, session, user_location_role}: {
    children: any,
    location: any,
    locationId: string,
    session: UserSession,
    user_location_role: RelationRoleLocation
}) => {
    const current_path = usePathname();

    return (
        <div
            className={"w-full h-full grid grid-cols-[auto_1fr] items-center justify-start grow"}
        >
            <aside
                className={"flex flex-col items-center w-full h-full bg-base-200 text-base-content md:border-t-2 border-base-300"}
            >
                <h1
                    className={"w-full font-bold p-4 hidden md:block text-nowrap"}
                >{location?.name}</h1>
                <div
                    className={"flex flex-col gap-4 w-full md:border-t-2 border-base-300 text-lg"}
                >
                    <ul
                        className={"menu menu-md gap-2"}
                    >
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Dashboard des Standorts"
                        ><Link
                            href={`/location/${locationId}`}
                            className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith(locationId) ? "active" : "")}
                        >
                            <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faHome}/>
                            <div
                                className={"hidden md:block ml-2"}
                            >
                                Dashboard
                            </div>
                        </Link></li>
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Gottesdienste und Events verwalten"
                        ><Link
                            href={`/location/${locationId}/planer`}
                            className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith("/planer") ? "active" : "")}
                        >
                            <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faCalendarAlt}/>
                            <div
                                className={"hidden md:block ml-2"}
                            >
                                Planer
                            </div>
                        </Link></li>
                        {
                            (["OWNER", "MANAGER"].includes(user_location_role as string) || session.user.role === "ADMIN") &&
                            <>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Zugriffslinks und Codes verwalten"
                                ><Link
                                    href={`/location/${locationId}/access`}
                                    className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith("/access") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faKey}/>
                                    <div
                                        className={"hidden md:block ml-2"}
                                    >
                                        Zugriff & Codes
                                    </div>
                                </Link>
                                </li>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Zugriffsanfragen verwalten"
                                ><Link
                                    href={`/location/${locationId}/requests`}
                                    className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith("/requests") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faEnvelope}/>
                                    <div
                                        className={"hidden md:block ml-2"}
                                    >
                                        Anfragen
                                    </div>
                                </Link></li>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Teammitglieder und Rollen des Standorts verwalten"
                                ><Link
                                    href={`/location/${locationId}/team`}
                                    className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith("/team") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faUsers}/>
                                    <div
                                        className={"hidden md:block ml-2"}
                                    >
                                        Team
                                    </div>
                                </Link></li>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Änderungen im großen Stil"
                                ><Link
                                    href={`/location/${locationId}/bulk-actions`}
                                    className={"font-semibold aspect-square md:aspect-auto flex item-center justify-center md:justify-start " + (current_path?.endsWith("/bulk-actions") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faTools}/>
                                    <div
                                        className={"hidden md:block ml-2"}
                                    >
                                        Bulk Actions
                                    </div>
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