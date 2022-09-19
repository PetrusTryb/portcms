import LocalizedStringEditor, {localizedString} from "../util/localizedString";
import React from "react";
import {BriefcaseIcon, DeviceMobileIcon, IdentificationIcon} from "@heroicons/react/solid";
import Loader from "../components/loader";

type SettingsState = {
    metadata?: {
        title?: localizedString,
        logo?: string,
        smallLogo?: string
    },
    pwa?: {
        name?: string,
        shortName?: string,
        displayMode?: string,
    }
    visible?: boolean,
    isLoading: boolean,
}
class AdminSettings extends React.Component<{}, SettingsState>{
    constructor(props: {}) {
        super(props);
        this.state = {
            isLoading: true,
        }
    }
    componentDidMount() {
        fetch('/api/auth',{
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||'',
                'cache-control': 'no-cache',
            }
        }).then(res => res.json().then(response => {
            if(response.error)
                window.location.href = '/cms/login'
        })).catch(err => {
                console.log(err);
            })

        fetch(`/api/config`, {
            headers: {
                'session': localStorage.getItem('session') || sessionStorage.getItem('session') || '',
                'cache-control': 'no-cache',
            },
        }).then(res => res.json().then(response => {
            if (!response.error) {
                this.setState(response);
                this.setState({isLoading: false});
            } else if (!document.location.pathname.startsWith('/cms/login'))
                document.location.href = '/cms/login';
        }))
    }
    submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.currentTarget;
        let formData = new FormData(form);
        let data = {
            "metadata": {
                "title": this.state.metadata?.title,
                "logo": formData.get("logo"),
                "smallLogo": formData.get("smallLogo")
            },
            "pwa": {
                "name": formData.get("PWA_name"),
                "short_name": formData.get("PWA_short_name"),
                "display": formData.get("PWA_display"),
                "icons": [
                    {
                        "src": formData.get("logo"),
                        "sizes": (document.getElementById("logoSize") as HTMLImageElement).naturalWidth + "x" + (document.getElementById("logoSize") as HTMLImageElement).naturalHeight,
                        "type": "image/png"
                    },
                    {
                        "src": formData.get("logo"),
                        "sizes": (document.getElementById("logoSize") as HTMLImageElement).naturalWidth + "x" + (document.getElementById("logoSize") as HTMLImageElement).naturalHeight,
                        "type": "image/jpg"
                    },
                    {
                        "src": formData.get("smallLogo"),
                        "sizes": (document.getElementById("smallLogoSize") as HTMLImageElement).naturalWidth + "x" + (document.getElementById("smallLogoSize") as HTMLImageElement).naturalHeight,
                        "type": "image/png"
                    },
                    {
                        "src": `https://ui-avatars.com/api/?name=${formData.get("PWA_name")}&format=png&size=144`,
                        "sizes": "144x144",
                        "type": "image/png"
                    }
                ]
            },
            "visible": this.state.visible
        };
        fetch(`/api/config/`, {
            method: "POST",
            headers: {
                "session": localStorage.getItem('session') || sessionStorage.getItem('session') || '',
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.location.href = "/cms/admin/settings/";
            } else {
                console.log("error");
            }
        }).catch(error => {
            console.log(error);
        })
    }


    render() {
        if(this.state.isLoading)
            return <Loader/>
        return <div className="w-full h-full flex flex-col ml-16">
            <header className="bg-neutral-100 dark:bg-gray-400 shadow-[0_0_4px_rgba(0,0,0,0.0884)]">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-black opacity-[.87] inline">Settings</h1>
                </div>
            </header>
            <main className="overflow-y-auto w-full block ml-auto mr-auto box-border pl-16 pr-16">
                <form onSubmit={this.submit}>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-4 sm:px-0">
                        <p className="dark:text-white text-dark text-lg">
                            This is the website settings page. Here you can change the website title, logo and other settings.
                            To change Your account settings, go to <a href="/cms/account" className="text-blue-500">Your Profile</a>.
                        </p>
                    </div>
                </div>
                <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-y-visible">
                <div className="bg-white dark:bg-gray-800 sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400 inline">
                            <IdentificationIcon className="mr-2 h-5 w-5 inline"/>
                            Website metadata
                        </h3>
                    </div>
                        <div className="px-4 py-4">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="col-span-1">
                                    <label htmlFor="title"
                                           className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Title
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <LocalizedStringEditor value={this.state.metadata?.title || {}} onChange={(e) => {
                                            this.setState({
                                                ...this.state,
                                                metadata: {
                                                    ...this.state.metadata,
                                                    title: e
                                                }
                                            })
                                        }}/>
                                        <label
                                            className="hidden 2xl:block text-sm uppercase h-36px leading-5 text-gray-700 dark:text-gray-400">
                                            The main name of Your website, recommended length is 65 to 70 characters.
                                            It will be shown on the navigation bar, in search engines and in browser's title bar
                                        </label>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="logo"
                                           className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Big logo URL
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="logo" name="logo" defaultValue={this.state.metadata?.logo}
                                               className="form-input block w-full dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                        <label htmlFor="logo"
                                               className="hidden 2xl:block text-sm w-1/3 uppercase h-36px text-center leading-5 text-gray-700 dark:text-gray-400">
                                        </label>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="smallLogo"
                                           className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Small logo URL
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="smallLogo" name="smallLogo" defaultValue={this.state.metadata?.smallLogo}
                                               className="form-input block w-full dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                        <label htmlFor="smallLogo"
                                               className="hidden 2xl:block text-sm w-1/3 uppercase h-36px text-center leading-5 text-gray-700 dark:text-gray-400">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-6 w-full h-20 bg-gray-50 dark:bg-gray-800">
                            <span className="inline-flex rounded-md shadow-sm float-right">
                                <button type="submit"
                                        className="inline-flex items-center px-4 py-2 border-solid border border-[#e6e6e6] text-sm leading-5 font-medium rounded-md text-white dark:bg-dark bg-accent hover:bg-accent2 dark:hover:bg-black focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Save changes
                                </button>
                            </span>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-y-visible">
                    <div className="bg-white dark:bg-gray-800 sm:rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400 inline">
                                <DeviceMobileIcon className="mr-2 h-5 w-5 text-accent inline"/>
                                Progressive Web App
                            </h3>
                        </div>
                        <div className="px-4 py-4">
                            <span className="block text-gray-700 dark:text-gray-500">
                                Progressive Web App is a web application that uses modern web capabilities to deliver an app-like user experience. They works on almost every platform, online or offline, and provides an experience that is almost as good as native apps. PortCMS supports PWA out of the box. As an operator of the website, you need only to provide a few details about your website and we will generate a manifest file for you.
                            </span>
                            <div className="grid grid-cols-2 gap-6 mt-2">
                                <div className="">
                                    <label htmlFor="PWA_name"
                                           className="text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Name
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="PWA_name" name="PWA_name" defaultValue={this.state.pwa?.name}
                                               className="form-input block w-full dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                        <label htmlFor="PWA_name"
                                               className="hidden 2xl:block text-sm uppercase h-36px leading-5 text-gray-700 dark:text-gray-400">
                                            Name of the application that will be shown on the home screen
                                        </label>
                                    </div>
                                </div>
                                <div className="">
                                    <label htmlFor="PWA_short_name"
                                           className="text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Short name
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <input id="PWA_short_name" name="PWA_short_name" defaultValue={this.state.pwa?.shortName}
                                               className="form-input block w-full dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                        <label htmlFor="PWA_short_name"
                                               className="hidden 2xl:block text-sm uppercase h-36px leading-5 text-gray-700 dark:text-gray-400">
                                            This field is optional. Slug of the app that will be shown on the home screen
                                        </label>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="PWA_display"
                                           className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                        Display mode
                                    </label>
                                    <div className="mt-1 rounded-md shadow-sm">
                                        <select id="PWA_display" name="PWA_display" className="form-input w-full sm:text-sm sm:leading-5 dark:bg-gray-800 dark:text-gray-100">
                                            <option value="browser" selected={this.state.pwa?.displayMode==="browser"}>Browser</option>
                                            <option value="minimal-ui" selected={this.state.pwa?.displayMode==="minimal-ui"}>Minimal UI</option>
                                            <option value="standalone" selected={this.state.pwa?.displayMode==="standalone"}>Standalone</option>
                                            <option value="fullscreen" selected={this.state.pwa?.displayMode==="fullscreen"}>Fullscreen</option>
                                        </select>
                                        <label htmlFor="PWA_display"
                                            className="hidden 2xl:block text-sm uppercase h-36px leading-5 text-gray-700 dark:text-gray-400">
                                            Please note that if "Browser" is selected, the app will not be installed on the user's device.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-6 w-full h-20 bg-gray-50 dark:bg-gray-800">
                        <span className="inline-flex rounded-md shadow-sm float-right">
                            <button type="submit"
                                    className="inline-flex items-center px-4 py-2 border-solid border border-[#e6e6e6] text-sm leading-5 font-medium rounded-md text-white dark:bg-dark bg-accent hover:bg-accent2 dark:hover:bg-black focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                Save changes
                            </button>
                        </span>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-y-visible">
                    <div className="bg-white dark:bg-gray-800 sm:rounded-lg">
                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400 inline">
                                <BriefcaseIcon className="mr-2 h-5 w-5 text-accent inline"/>
                                Maintenance mode
                            </h3>
                        </div>
                        <div className="px-4 py-4">
                            <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-6 lg:px-8">
                                <p className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-300 sm:text-2xl">
                                    <span className="block">Temporarily hide Your website from the public when You are making changes</span>
                                    <span className="block text-gray-800 dark:text-gray-400">Maintenance mode is currently {!this.state.visible?"ON":"OFF"}</span>
                                    <span className="block text-gray-700 dark:text-gray-500 text-sm italic">When maintenance mode is switched on, only administrators will be able to see this website. Other users will be informed to try again later.</span>
                                </p>
                                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                                    {this.state.visible &&
                                        <div className="inline-flex rounded-md shadow">
                                            <button type="button" onClick={()=>this.setState({...this.state, visible: false},()=>document.forms[0].requestSubmit())}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
                                            >
                                                Enable maintenance mode
                                            </button>
                                        </div>
                                    }
                                    {!this.state.visible &&
                                        <div className="inline-flex rounded-md shadow">
                                            <button type="button" onClick={()=>this.setState({...this.state, visible: true},()=>document.forms[0].requestSubmit())}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-5 py-3 text-base font-medium text-white hover:bg-gray-700"
                                            >
                                                Disable maintenance mode
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                </form>
            </main>
            <img src={this.state.metadata?.logo} className="hidden" alt="" id="logoSize"/>
            <img src={this.state.metadata?.smallLogo} className="hidden" alt="" id="smallLogoSize"/>
        </div>
    }
}
export default AdminSettings