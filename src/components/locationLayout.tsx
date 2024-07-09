"use client";

import Link from "next/link";
import {UserSession} from "@/lib/types";
import {RelationRoleLocation} from "@prisma/client";
import {usePathname} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";


const LocationLayout = ({children, location, locationId, session, user_location_role}: {
    children: any,
    location: any,
    locationId: string,
    session: UserSession,
    user_location_role: RelationRoleLocation
}) => {
    const [expanded, setExpanded] = useState(true);
    const current_path = usePathname();
    useEffect(() => {
        // Check if running in the browser (where `window` exists)
        if (typeof window !== 'undefined') {
            const savedTheme = JSON.parse(localStorage.getItem("location_layout_expanded") ?? "true");
            setExpanded(savedTheme);

            const handleResize = () => {
                if (window.innerWidth < 768) {
                    setExpanded(false);
                } else {
                    const localstorage = localStorage.getItem("location_layout_expanded");
                    setExpanded(localstorage ? JSON.parse(localstorage) : true);
                }
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    const handleLayoutChange = () => {
        if (typeof window !== 'undefined') {
            setExpanded(!expanded);
            localStorage.setItem("location_layout_expanded", JSON.stringify(!expanded));
        }
    };

    return (
        <div
            className={"w-full h-full grid grid-cols-[auto_1fr] items-center justify-start grow"}
        >
            <aside
                className={"flex flex-col items-center w-full h-full bg-base-200 text-base-content  border-base-300"}
            >
                <h1
                    className={"w-full font-bold p-4 text-nowrap border-base-300 " + (expanded ? "border-y-2 block" : " hidden")}
                >{location?.name}</h1>
                <div
                    className={"flex flex-col gap-4 w-full text-lg"}
                >
                    <ul
                        className={"menu menu-md gap-2"}
                    >
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Menü ein-/ausblenden"
                        >
                            <div
                                className={"font-semibold flex item-center justify-center " + (expanded ? "aspect-auto" : "aspect-square")}
                                onClick={() => handleLayoutChange()}
                            >
                                {
                                    expanded ?
                                        <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faCompress}/> :
                                        <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faExpand}/>
                                }
                            </div>
                        </li>
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Dashboard des Standorts"
                        ><Link
                            href={`/location/${locationId}`}
                            className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith(locationId) ? "active" : "")}
                        >
                            <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faHome}/>
                            <div
                                className={"ml-2 " + (expanded ? "block" : "hidden")}
                            >
                                Dashboard
                            </div>
                        </Link></li>
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Gottesdienste und Events verwalten"
                        ><Link
                            href={`/location/${locationId}/planer`}
                            className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/planer") ? "active" : "")}
                        >
                            <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faCalendarAlt}/>
                            <div
                                className={"ml-2 " + (expanded ? "block" : "hidden")}
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
                                    className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/access") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faKey}/>
                                    <div
                                        className={"ml-2 " + (expanded ? "block" : "hidden")}
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
                                    className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/requests") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faEnvelope}/>
                                    <div
                                        className={"ml-2 " + (expanded ? "block" : "hidden")}
                                    >
                                        Anfragen
                                    </div>
                                </Link></li>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Teams verwalten"
                                ><Link
                                    href={`/location/${locationId}/teams`}
                                    className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/teams") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faUsersRectangle}/>
                                    <div
                                        className={"ml-2 " + (expanded ? "block" : "hidden")}
                                    >
                                        Teams
                                    </div>
                                </Link></li>
                                <li
                                    className={"tooltip tooltip-right"}
                                    data-tip="Das Team des Standorts"
                                ><Link
                                    href={`/location/${locationId}/team`}
                                    className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/team") ? "active" : "")}
                                >
                                    <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faUsers}/>
                                    <div
                                        className={"ml-2 " + (expanded ? "block" : "hidden")}
                                    >
                                        Team
                                    </div>
                                </Link></li>
                            </>
                        }
                        <li
                            className={"tooltip tooltip-right"}
                            data-tip="Änderungen im großen Stil"
                        ><Link
                            href={`/location/${locationId}/bulk-actions`}
                            className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (current_path?.endsWith("/bulk-actions") ? "active" : "")}
                        >
                            <FontAwesomeIcon className={"aspect-square h-4"} icon={fas.faTools}/>
                            <div
                                className={"ml-2 " + (expanded ? "block" : "hidden")}
                            >
                                Bulk Actions
                            </div>
                        </Link></li>
                    </ul>
                </div>
            </aside>
            {children}
        </div>
    )
}

export default LocationLayout;