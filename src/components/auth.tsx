import { LockClosedIcon, ExclamationIcon } from '@heroicons/react/solid'
import React, {useState} from "react";
export type AuthProps = {
    id: string,
    type: "auth",
    data: {
        title: string,
        logo?: string,
        mode: "register" | "login" | "reset",
        disableLogin?: boolean,
        disableRegister?: boolean,
        disablePasswordReset?: boolean,
    },
    userData?: {
        "_id": string,
        "username": string,
        "roles": string[]
    }
}
export default function Auth(Props: AuthProps) {
    let [authError,setAuthError] = useState<string>("");
    let submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.currentTarget;
        let formData = new FormData(form);
        let data = {
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            mode: Props.data.mode,
        }
        fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify(data)
            }
        ).then(res => res.json().then(data => {
            if(data.error){
                setAuthError(data.error.errorMessage);
            }
            else{
                if(formData.get("remember-me") === "on"){
                    localStorage.setItem("session", data.id);
                }
                else{
                    sessionStorage.setItem("session", data.id);
                }
                window.location.href = "/";
            }
        })).catch(err => {
            console.error(err);
            setAuthError("An error occurred while trying to authenticate you. Please try again later.");
        });
    }
    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-700">
                <div className="max-w-2xl w-full space-y-8">
                    <div>
                        {Props.data.logo && (
                            <img
                                className="mx-auto h-12 w-auto"
                                src={Props.data.logo}
                                alt="Logo"
                            />
                        )}
                        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">{Props.data.title}</h2>
                        {Props.data.mode === "register" && !Props.data.disableLogin && (
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                            Have an account?{' '}
                            <a href="/cms/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                Sign in
                            </a>
                        </p>
                        )}
                        {Props.data.mode === "login" && !Props.data.disableRegister && (
                            <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-300">
                                Don't have an account?{' '}
                                <a href="/cms/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                    Register now!
                                </a>
                            </p>
                        )}
                    </div>
                    {authError && (
                    <div className="bg-red-600 rounded-md">
                        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="w-0 flex-1 flex items-center">
        <span className="flex p-2 rounded-lg bg-red-800">
            <ExclamationIcon className="h-5 w-5 text-yellow-500"></ExclamationIcon>
        </span>
                                    <p className="ml-3 font-medium text-white truncate">
                                        <span> {authError} </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={submit}>
                        <input type="hidden" name="mode" value={Props.data.mode} />
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    maxLength={50}
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            {Props.data.mode === "register" && (
                            <div>
                                <label htmlFor="username" className="sr-only">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    maxLength={20}
                                    autoComplete="username"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Username"
                                />
                            </div>
                            )}
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={Props.data.mode === "register" ? "new-password" : "current-password"}
                                    minLength={8}
                                    maxLength={50}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            {Props.data.mode !== "reset" && (
                                <>
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-400">
                                    Remember me
                                </label>
                            </div>
                                    {!Props.data.disablePasswordReset && (
                            <div className="text-sm">
                                <a href="/cms/reset_password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                                {Props.data.mode === "login" && "Sign in"}
                                {Props.data.mode === "register" && "Register"}
                                {Props.data.mode === "reset" && "Reset password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
