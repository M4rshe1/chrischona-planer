'use client';


import React, {useEffect} from "react";
import {useSession} from "next-auth/react";

type Props = {
    children: React.ReactNode;
}


const SessionUpdater = ({ children }: Props) => {
    const { data: session, status, update } = useSession();

    useEffect(() => {
        const interval = setInterval(() => {
            update().then(r => console.log(r)).catch(e => console.error(e)) // Update session every 15 seconds
        }, 1000 * 60 * 60)
        return () => clearInterval(interval)
    }, [update]);

    return (
        <>{children}</>
    );
}

export default SessionUpdater;