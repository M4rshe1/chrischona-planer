"use client"

import {useSearchParams} from "next/navigation";

const Zeitplan = ({gottesdienst, sections}: {gottesdienst: any, sections: any}) => {
    const query = useSearchParams()
    if (query.get("preview") !== "true") {
        window.print()
    }

    return (
        <div
            className={"p-4 flex flex-col justify-start items-center h-full gap-4 w-full fixed inset-0"}
        >
            <h1>Print</h1>
        </div>
    );
}

export default Zeitplan;