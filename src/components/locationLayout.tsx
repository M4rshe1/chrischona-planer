"use client";

import {UserSession} from "@/lib/types";
import {RelationRoleLocation} from "@prisma/client";
import {fas} from "@fortawesome/free-solid-svg-icons";
import LayoutLink from "@/components/layoutLink";


const LocationLayout = ({children, location, locationId, session, user_location_role}: {
    children: any,
    location: any,
    locationId: string,
    session: UserSession,
    user_location_role: RelationRoleLocation
}) => {
    return (
        <div
            className={"w-full h-full relative pl-16"}
        >
            <aside
                className={"flex flex-col items-center h-full bg-base-200 text-base-content border-base-300 shadow-lg absolute top-0 left-0 bottom-0 z-10 group"}
            >
                <div
                    className={"gap-2 flex flex-col items-start justify-start p-2"}
                >
                    <LayoutLink
                        link={`/location/${locationId}`}
                        text={"Dashboard"}
                        tooltip={"Dashboard des Standorts"}
                        icon={fas.faHome}
                    />
                    <LayoutLink
                        link={`/location/${locationId}/planer`}
                        text={"Planer"}
                        tooltip={"Gottesdienste und Events verwalten"}
                        icon={fas.faCalendarAlt}
                    />
                    <LayoutLink
                        link={`/location/${locationId}/teams`}
                        text={"Teams"}
                        tooltip={"Teams verwalten"}
                        icon={fas.faUsersRectangle}
                    />
                    <LayoutLink
                        link={`/location/${locationId}/team`}
                        text={"Team"}
                        tooltip={"Das Team des Standorts"}
                        icon={fas.faUsers}
                    />
                    {
                        (["OWNER", "MANAGER"].includes(user_location_role as string) || session.user.role === "ADMIN") &&
                        <>
                            <LayoutLink
                                link={`/location/${locationId}/requests`}
                                text={"Anfragen"}
                                tooltip={"Zugriffsanfragen verwalten"}
                                icon={fas.faEnvelope}
                            />
                            <LayoutLink
                                link={`/location/${locationId}/access`}
                                text={"Zugriffscodes"}
                                tooltip={"Zugriffscodes und Links verwalten"}
                                icon={fas.faKey}
                            />
                            <LayoutLink
                                link={`/location/${locationId}/bulk-actions`}
                                text={"Bulk Actions"}
                                tooltip={"Änderungen im großen Stil"}
                                icon={fas.faTools}
                                badge={"Beta"}
                            />
                        </>
                    }
                </div>
            </aside>
            {children}
        </div>
    )
}

export default LocationLayout;