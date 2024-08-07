'use client'

import {signIn, signOut} from "next-auth/react";
import Link from "next/link";
import {redirect} from "next/navigation";

export const LoginButton = ({className = ''}: { className: string }) => {
    return (
        <button
            className={'btn ml-2 btn-primary ' + className}
            onClick={() => signIn()}>Anmelden</button>
    )
}

export const LogoutButton = ({className = ''}: { className: string }) => {
    return (
        <button
            className={'btn btn-neutral ' + className}
            onClick={() => {
                signOut().then(() => {
                    return redirect('/')
                })
            }}>Abmelden
        </button>
    )
}

export const RegisterButton = ({className = ''}: { className: string }) => {
    return (
        <Link href={'/auth/register'} className={'btn bg-base-100 ' + className}>
            Registrieren
        </Link>
    )
}



