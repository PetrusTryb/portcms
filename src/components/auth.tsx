import { LockClosedIcon, ExclamationIcon } from '@heroicons/react/solid'
import React from "react";
export type AuthProps = {
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
type AuthState = {
    authError: string,
}
class Auth extends React.Component<AuthProps, AuthState> {
    constructor(props: AuthProps) {
        super(props);
        this.state = {
            authError: "",
        }
    }
    componentDidMount() {
        this.setState({ authError: "Checking authentication status..." });
        fetch('/api/auth', {
            method: 'GET',
            headers: {
                'session': localStorage.getItem('session') || sessionStorage.getItem('session') || '',
                'cache-control': 'no-cache',
            }
        }).then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    if(data.roles.includes('admin')){
                        this.setState({ authError: `You are already logged in as an admin (${data.username}).` });
                        window.location.href = "/cms/admin";
                    }
                    else {
                        this.setState(
                            {
                                authError: `You are already logged in as ${data.username}. Maybe Your permissions are not sufficient to access this page.`,
                            }
                        );
                    }
                })
            }
            else {
                this.setState({ authError: "" });
            }
        })
    }
    submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.currentTarget;
        let formData = new FormData(form);
        let data = {
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            mode: this.props.data.mode,
        }
        fetch("/api/auth", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "sec-ch-ua": navigator.platform,
                }
            }
        ).then(res => res.json().then(data => {
            if(data.error){
                this.setState({authError: data.error.errorMessage});
            }
            else{
                this.setState({authError: "Correct! Redirecting..."});
                if(formData.get("remember-me") === "on"){
                    localStorage.setItem("session", data.id);
                }
                else{
                    sessionStorage.setItem("session", data.id);
                }
                window.location.href = "/?forceReload=true";
            }
        })).catch(err => {
            this.setState({authError: "An error occurred. Please try again later."});
        });
    }
    render() {
        return (
            <>
                <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-700">
                    <div className="max-w-2xl w-full space-y-8">
                        <div>
                            {this.props.data.logo && (
                                <img
                                    className="mx-auto h-12 w-auto"
                                    src={this.props.data.logo}
                                    alt="Logo"
                                />
                            )}
                            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-200">{this.props.data.title}</h2>
                            {this.props.data.mode === "register" && !this.props.data.disableLogin && (
                                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                                    Have an account?{' '}
                                    <a href="/cms/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                        Sign in
                                    </a>
                                </p>
                            )}
                            {this.props.data.mode === "login" && !this.props.data.disableRegister && (
                                <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-300">
                                    Don't have an account?{' '}
                                    <a href="/cms/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">
                                        Register now!
                                    </a>
                                </p>
                            )}
                        </div>
                        {this.state.authError && (
                            <div className="bg-red-600 rounded-md">
                                <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                                    <div className="flex items-center justify-between flex-wrap">
                                        <div className="w-0 flex-1 flex items-center">
        <span className="flex p-2 rounded-lg bg-red-800">
            <ExclamationIcon className="h-5 w-5 text-yellow-500"></ExclamationIcon>
        </span>
                                            <p className="ml-3 font-medium text-white truncate">
                                                <span> {this.state.authError} </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <form className="mt-8 space-y-6" onSubmit={this.submit}>
                            <input type="hidden" name="mode" value={this.props.data.mode} />
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
                                {this.props.data.mode === "register" && (
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
                                {this.props.data.mode !== "reset" && (
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete={this.props.data.mode === "register" ? "new-password" : "current-password"}
                                        minLength={8}
                                        maxLength={50}
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-200 dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                {this.props.data.mode !== "reset" && (
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
                                        {!this.props.data.disablePasswordReset && (
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
                                    {this.props.data.mode === "login" && "Sign in"}
                                    {this.props.data.mode === "register" && "Register"}
                                    {this.props.data.mode === "reset" && "Reset password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}
export default Auth
