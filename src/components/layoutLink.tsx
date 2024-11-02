"use client";

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";

const LayoutLink = ({link,  text, tooltip, icon, badge}: {
    link: string,
    text: string,
    tooltip: string,
    icon: any,
    badge?: string
}) => {
    const path = usePathname();
    const match = path?.endsWith(link) || false

    return (
            <Link
            data-tip={tooltip}
            href={link}
            className={"tooltip tooltip-right font-semibold flex item-center rounded justify-start group-hover:w-auto aspect-square group-hover:aspect-auto min-w-10 h-10 w-full hover:bg-base-300" + (match ? "bg-neutral " : "")}
        >
            <FontAwesomeIcon className={"aspect-square h-4"} icon={icon}/>
            <div
                className={"group-hover:ml-2 w-0 group-hover:w-auto transition-all overflow-hidden group-hover:overflow-visible duration-300 ease-in-out whitespace-nowrap text-sm"}
            >

                {text}
                {badge && <span className={"group-hover:ml-2 badge badge-primary transition-all duration-300 ease-in-out"}>{badge}</span>}
            </div>
            {
                 badge && <div
                    className={"absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-primary h-3 w-3 flex items-center justify-center text-xs font-semibold text-white"}
                ></div>
            }
        </Link>
    )
}

export default LayoutLink;