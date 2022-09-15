import React from "react";
import Loader from "../components/loader";
import {ExclamationIcon} from "@heroicons/react/solid";

type AccountSettingsProps = {
    userId?: string;
}
type AccountSettingsState = {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    sessions: Array<{
        id: string;
        ip: string;
        country: string;
        browser: string;
        os: string;
        created: string;
    }>;
    isLoading: boolean;
    error: string;
}
class AccountSettings extends React.Component<AccountSettingsProps, AccountSettingsState> {
    constructor(props: AccountSettingsProps) {
        super(props);
        this.state = {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            sessions: [],
            isLoading: true,
            error: ""
        };
    }
    load() {
        fetch("/api/auth/",{
            method: "GET",
            headers: {
                "session": localStorage.getItem("session") || sessionStorage.getItem("session") || "",
                "cache-control": "no-cache"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        error: data.error.errorMessage,
                        isLoading: false
                    });
                }
                this.setState({
                    userName: data.username,
                    email: data.email,
                    sessions: data.sessions,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                error: error.message,
                isLoading: false
            });
        });
    }
    componentDidMount() {
        this.load();
    }
    updateProfile(){
        this.setState({isLoading: true});
        fetch("/api/auth/",{
            method: "PATCH",
            headers: {
                "session": localStorage.getItem("session") || sessionStorage.getItem("session") || "",
                "cache-control": "no-cache"
            },
            body: JSON.stringify({
                mode: "update",
                email: this.state.email,
                username: this.state.userName
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error)
                    this.setState({error: data.error.errorMessage, isLoading: false});
                else
                    this.setState({isLoading: false});
            });
    }
    changePassword(){
        if(this.state.password !== this.state.confirmPassword){
            this.setState({error: "Passwords do not match"});
            return;
        }
        this.setState({isLoading: true});
        fetch("/api/auth/",{
            method: "PATCH",
            headers: {
                "session": localStorage.getItem("session") || sessionStorage.getItem("session") || "",
                "cache-control": "no-cache"
            },
            body: JSON.stringify({
                mode: "changePassword",
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error)
                    this.setState({error: data.error.errorMessage, isLoading: false});
                else
                    this.setState({isLoading: false});
            });
    }
    endSession(id: string){
        fetch("/api/auth/",{
            method: "PATCH",
            headers: {
                "session": localStorage.getItem("session") || sessionStorage.getItem("session") || "",
                "cache-control": "no-cache"
            },
            body: JSON.stringify({
                mode: "endSession",
                session:id
            })
        })
            .then(response => response.json())
            .then(data => {
                if(data.error)
                    this.setState({error: data.error.errorMessage, isLoading: false});
                else
                    this.load();
            });
    }
    render() {
        if(this.state.isLoading)
            return <Loader/>;
        return (
            <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow overflow-hidden sm:rounded-lg mx-10 max-h-screen overflow-y-scroll">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Account Settings
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Here you can update your account preferences.
                    </p>
                </div>
                {this.state.error.length>0 && (
                    <div className="bg-red-600 rounded-md">
                        <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="w-0 flex-1 flex items-center">
        <span className="flex p-2 rounded-lg bg-red-800">
            <ExclamationIcon className="h-5 w-5 text-yellow-500"></ExclamationIcon>
        </span>
                                    <p className="ml-3 font-medium text-white truncate">
                                        <span> {this.state.error} </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                    <div className="border-t border-gray-200 dark:border-gray-500">
                        <dl>
                            <div
                                className="bg-white dark:bg-gray-900 dark:text-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Nickname
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                    <input type="text" name="login" className="w-3/4 mr-4 dark:bg-gray-800 relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" defaultValue={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})}/>
                                    <button onClick={()=>this.updateProfile()}
                                            className="inline-flex justify-center py-2 px-4 w-1/5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Change username
                                    </button>
                                </dd>
                            </div>
                            <div
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Email address
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                    <input type="text" name="email" className="w-3/4 mr-4 dark:bg-gray-800 relative px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" defaultValue={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
                                    <button onClick={()=>this.updateProfile()}
                                            className="inline-flex justify-center py-2 px-4 w-1/5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Change email address
                                    </button>
                                </dd>
                            </div>
                            <div
                                className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Active sessions
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                        {this.state.sessions?.map((session) => (
                                            <li key={session.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                                <div className="w-0 flex-1 flex items-center">
                                                    <p>{session.browser?.split(";")[0].replaceAll("\"","")||"Unknown browser"} on {session.os?.replaceAll("\"","")||"unknown device"}
                                                        {localStorage.getItem("session") === session.id || sessionStorage.getItem("session") === session.id ? <b> (this session)</b> : ""}
                                                        <br/>
                                                        <span className="text-gray-500">{session.country||"Unknown country"} ({session.ip})</span> <br/>
                                                        <span className="text-gray-500">Created at {new Date(session.created).toLocaleString()}</span>
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <button type="button" onClick={() => this.endSession(session.id)}
                                                            className="font-medium text-indigo-600 hover:text-indigo-500">
                                                        Sign out
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div
                                className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    <label htmlFor="password">New password</label>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                    <input id="password" minLength={8} name="password" type="password" onChange={(e) => this.setState({password: e.target.value})} autoComplete="new-password"
                                           required={true}
                                           className="dark:bg-gray-800 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                                </dd>
                            </div>
                            <div
                                className="bg-white dark:bg-gray-900 dark:text-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    <label htmlFor="password2">Repeat password</label>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                                    <input id="password2" type="password" required={true} autoComplete="off" onChange={(e) => this.setState({confirmPassword: e.target.value})}
                                           className="dark:bg-gray-800 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"/>
                                </dd>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                                <button onClick={() => this.changePassword()}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Change password
                                </button>
                            </div>
                        </dl>
                    </div>
            </div>
        );
    }
}
export default AccountSettings;