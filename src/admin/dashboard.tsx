import {useEffect, useState} from "react";
import {InformationCircleIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon} from '@heroicons/react/solid';

type dashboardState = {
    user: {
        username: string,
        sessionId: string,
    }
    pages: Array<{
        id: string,
        url: string,
        title: string,
    }>,
    status: Array<{
        type: "success" | "warning" | "error",
        message: string,
        link?: string,
    }>
}

const fetchDashboardData = new Promise<dashboardState>((resolve) => {
    let data: dashboardState = {
        user: {
            username: '',
            sessionId: '',
        },
        pages: [],
        status: [
            {
                type: "success",
                message: "PortCMS has been successfully installed.",
            },
            {
                type: "warning",
                message: "Website name is not set. Please set it in the settings.",
                link: "/cms/admin/settings",
            },
            {
                type: "warning",
                message: "You don't have any pages yet. Create one now!",
                link: "/cms/admin/pages",
            }
        ],
    }
    fetch('/api/auth',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
        },

    }).then(res => res.json().then(response => {
        data.user.username = response.username || '';
        resolve(data);
    })).catch(err => {
        console.log(err);
    })
})

export default function AdminDashboard(){
    let [data, setData] = useState<dashboardState>();
    useEffect(() => {
        fetchDashboardData.then(data => {
            setData(data);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            console.log('finally');
        })
    }, [])
    return <div className="relative ml-16">
        <header className="bg-white dark:bg-gray-400 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 inline">Dashboard</h1>
            </div>
        </header>
        <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    <h1 className="text-gray-300 text-2xl">Hello, {data?.user.username}!</h1>
                    <p className="text-gray-300 text-lg">Welcome to Your website's admin panel</p>
                </div>
            </div>
        </main>
        <section>
            <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-t-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                            <InformationCircleIcon className="mr-2 w-5 h-5 inline"/>
                            Website status
                        </h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-b-lg">
                    {(data?.status||[]).map((status, index) => {
                        return <a href={status.link}>
                        <div key={index} className="px-4 py-5 border-b border-gray-200 dark:border-y-gray-900 sm:px-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {status.type === "success" ?
                                        <CheckCircleIcon className="w-5 h-5 inline text-green-600"/> : status.type === "warning" ?
                                            <ExclamationCircleIcon className="w-5 h-5 inline text-orange-600"/> :
                                            <XCircleIcon className="w-5 h-5 inline text-red-600"/>}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-400">{status.message}</p>
                                </div>
                            </div>
                        </div>
                        </a>
                    })}
                </div>
            </div>
        </section>
        <section>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                            <ClockIcon className="mr-2 w-5 h-5 inline"/>
                            Recently edited pages
                        </h3>
                    </div>
                    <div className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-6">
                            {data?.pages.length?data?.pages.map(page => <div key={page.id} className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {page.title}
                                    </h3>
                                </div>
                                <div className="px-4 py-4">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                    {page.url}
                                                </h3>
                                            </div>
                                            <div className="px-4 py-4">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                                            <h3 className="text-lg leading-6 font-medium text-gray-300">
                                                                <a href={page.url}>
                                                                    {page.url}
                                                                </a>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>):<div className="bg-white dark:bg-gray-600 shadow sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <a href="/cms/admin/pages/create">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 italic">
                                            You have no pages yet. Create one!
                                        </h3>
                                    </a>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

}