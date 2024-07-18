"use client";

import {UserSession} from "@/lib/types";
import {RelationRoleLocation} from "@prisma/client";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import DashboardLink from "@/components/dashboardLink";


const LocationLayout = ({children, location, locationId, session, user_location_role}: {
    children: any,
    location: any,
    locationId: string,
    session: UserSession,
    user_location_role: RelationRoleLocation
}) => {
    const [expanded, setExpanded] = useState(true);
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
                        <DashboardLink
                            link={`/location/${locationId}`}
                            expanded={expanded}
                            text={"Dashboard"}
                            tooltip={"Dashboard des Standorts"}
                            icon={fas.faHome}
                        />
                        <DashboardLink
                            link={`/location/${locationId}/planer`}
                            expanded={expanded}
                            text={"Planer"}
                            tooltip={"Gottesdienste und Events verwalten"}
                            icon={fas.faCalendarAlt}
                        />
                        <DashboardLink
                            link={`/location/${locationId}/teams`}
                            expanded={expanded}
                            text={"Teams"}
                            tooltip={"Teams verwalten"}
                            icon={fas.faUsersRectangle}
                        />
                        <DashboardLink
                            link={`/location/${locationId}/team`}
                            expanded={expanded}
                            text={"Team"}
                            tooltip={"Das Team des Standorts"}
                            icon={fas.faUsers}
                        />
                        {
                            (["OWNER", "MANAGER"].includes(user_location_role as string) || session.user.role === "ADMIN") &&
                            <>
                                <DashboardLink
                                    link={`/location/${locationId}/requests`}
                                    expanded={expanded}
                                    text={"Anfragen"}
                                    tooltip={"Zugriffsanfragen verwalten"}
                                    icon={fas.faEnvelope}
                                />
                                <DashboardLink
                                    link={`/location/${locationId}/access`}
                                    expanded={expanded}
                                    text={"Zugriffscodes und Links"}
                                    tooltip={"Zugriffscodes und Links verwalten"}
                                    icon={fas.faKey}
                                />
                                <DashboardLink
                                    link={`/location/${locationId}/bulk-actions`}
                                    expanded={expanded}
                                    text={"Bulk Actions"}
                                    tooltip={"Änderungen im großen Stil"}
                                    icon={fas.faTools}
                                />
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