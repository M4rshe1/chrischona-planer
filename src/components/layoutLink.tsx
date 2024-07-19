"use client";

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";

const LayoutLink = ({link, expanded, text, tooltip, icon, badge}: {
    link: string,
    expanded: boolean,
    text: string,
    tooltip: string,
    icon: any,
    badge?: string
}) => {
    const path = usePathname();
    const match = path?.endsWith(link) || false

    return (
        <li
            className={"tooltip tooltip-right relative"}
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
                {badge && <span className={"ml-2 badge badge-primary"}>{badge}</span>}
            </div>
            {
                !expanded && badge && <div
                    className={"absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-primary h-3 w-3 flex items-center justify-center text-xs font-semibold text-white"}
                ></div>
            }
        </Link></li>
    )
}

export default LayoutLink;