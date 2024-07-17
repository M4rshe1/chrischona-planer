"use client";

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";

const DashboardLink = ({link, expanded, text, tooltip, icon}: { link: string, expanded: boolean, text: string, tooltip: string, icon: any}) => {
    const path = usePathname();
    const match = path.endsWith(link)

    return (
        <li
            className={"tooltip tooltip-right"}
            data-tip={tooltip}
        ><Link
            href={link}
            className={"font-semibold flex item-center " + (expanded ? "aspect-auto justify-start " : "aspect-square justify-center ") + (match ? "active" : "")}
        >
            <FontAwesomeIcon className={"aspect-square h-4"} icon={icon}/>
            <div
                className={"ml-2 " + (expanded ? "block" : "hidden")}
            >
                {text}
            </div>
        </Link></li>
    )
}

export default DashboardLink;