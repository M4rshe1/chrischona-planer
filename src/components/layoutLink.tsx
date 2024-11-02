"use client";

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePathname} from "next/navigation";

const LayoutLink = ({link, text, tooltip, icon, badge}: {
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
            className={`group flex items-center gap-2 p-2 pl-3 ${match ? "bg-primary text-white" : "text-base-content"} w-10 group-hover:w-[200px] transition-all duration-300 ease-in-out relative rounded hover:bg-neutral hover:text-white`}
        >

            <FontAwesomeIcon className={"aspect-square h-4 self-center"} icon={icon}/>
            <div
                className={"group-hover:ml-2 w-0 group-hover:w-[170px] transition-all overflow-hidden opacity-0 group-hover:opacity-100 duration-300 ease-in-out whitespace-nowrap text-sm"}
            >

                <span>
                {text}
                </span>
                {badge && <span
                    className={"group-hover:ml-2 badge badge-primary transition-all duration-300 ease-in-out"}>{badge}</span>}
            </div>
            {
                badge && <div
                    className={"absolute top-0 right-0 -mt-1 -mr-1 rounded-full bg-primary h-3 w-3 flex items-center justify-center text-xs font-semibold text-white group-hover:opacity-0 transition-all duration-300 ease-in-out"}></div>

            }
        </Link>
    )
}

export default LayoutLink;