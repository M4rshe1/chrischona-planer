import {RelationRoleGottesdienst, RelationRoleLocation, SiteRole} from "@prisma/client";

export const dateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

export type UserSession = {
    user: {
        id: string;
        email: string;
        name: string;
        role: SiteRole
        iat: number;
        exp: number;
        jti: string;
        locations: {
            name: string,
            address: string,
            id: string,
            relation: RelationRoleLocation
        }[]
    }
}

export type EditableTableColumn = {
    name: string,
    label: string,
    type: "hidden" | "time" | "number" | "text" | "select" | "email" | "date" | "textarea" | "checkbox" | "multiSelect" | "link",
    toggle: boolean,
    disabled: boolean
    min?: number,
    max?: number,
    options?: { value: string, label: string }[],
}

export type EditableTableRowAction = {
    tooltip: string,
    handler: (row: any) => void,
    icon: any,
    style: string
}

export type EditableTableHeaderAction = {
    tooltip: string,
    handler: () => void,
    icon: any,
    style: string
}

export type TeamFilterType = {
    key: string,
    name: RelationRoleGottesdienst
    exclude: string[],
    queue: string[],
    behind: number,
    selected: boolean,
    count: number
}