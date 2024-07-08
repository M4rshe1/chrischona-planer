import {RelationRoleLocation, SiteRole} from "@prisma/client";

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