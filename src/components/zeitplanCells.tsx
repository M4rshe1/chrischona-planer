"use client"

import React from "react";

const HeaderCell = ({children, style}: { children?: React.ReactNode, style?: string }) => {
    return (
        <div className={"border border-neutral px-2 font-bold bg-gray-400 text-sm text-black " + style}>{children}</div>
    )
}

const DataCell = ({children, style}: { children?: React.ReactNode, style?: string  }) => {
    return (
        <div className={"border border-neutral px-2 text-sm text-base-content " + style}>{children}</div>
    )

}

export {HeaderCell, DataCell};