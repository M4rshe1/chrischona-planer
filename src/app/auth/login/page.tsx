"use client"
import {signIn, useSession} from "next-auth/react";
import React, {useEffect} from "react";
import {redirect} from "next/navigation";
import Link from "next/link";

const LoginPage = (req: any) => {
    const session = useSession()
    useEffect(() => {
        if (session.data) {
            redirect('/')
        }
    }, [session])

    async function login(formData: FormData) {
        const result = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: true,
            redirectUrl: '/'
        })
    }

    return (
        <div
            className={
                "flex flex-col items-center justify-center h-screen"
            }
        >
            <form action={login}
                  className={'grid gap-4 w-96 bg-base-200 p-4 rounded-md shadow-lg text-center'}
            >
                <h1
                    className={
                        "text-2xl font-bold"
                    }
                >Login</h1>
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                         className="w-4 h-4 opacity-70">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
                    </svg>

                    <input type="email" className="grow" placeholder="email" name='email'/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                         className="w-4 h-4 opacity-70">
                        <path fillRule="evenodd"
                              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                              clipRule="evenodd"/>
                    </svg>
                    <input type="password" className="grow" placeholder='password' name='password'/>
                </label>
                <button className={'btn grow'} type="submit">Login</button>
                {
                    req.searchParams?.error ? <div
                        className={"flex items-center justify-center border-red-800 border-2 rounded-md p-2 mt-2 text-red-800 bg-opacity-30 bg-red-800 font-bold"}
                    >
                        {
                            req.searchParams?.error
                        }
                    </div> : null
                }
                {
                    req.searchParams?.success ? <div
                        className={"flex items-center justify-center border-green-800 border-2 rounded-md p-2 mt-2 text-green-800 bg-opacity-30 bg-green-800 font-bold"}
                    >
                        {
                            req.searchParams?.success
                        }
                    </div> : null
                }
            </form>
            <div>
                <Link className={"link"} href={'/auth/register'}>Don&apos;t have an account?</Link>
            </div>
        </div>
    );
}

export default LoginPage;