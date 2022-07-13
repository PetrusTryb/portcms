import {useEffect, useState} from "react";
import {StatusMessages, StatusMessage} from "./statusMessages";
import RecentPages from "./recentPages";

type dashboardState = {
    username: string,
    pages: Array<{
        id: string,
        url: string,
        title: string,
    }>,
    status: Array<StatusMessage>
}

const fetchDashboardData = new Promise<dashboardState>((resolve) => {
    let data: dashboardState = {
        username: '',
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
        headers: {
            'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
        },
    }).then(res => res.json().then(response => {
        if(!response.error && response.roles?.includes('admin'))
            data.username = response.username;
        else if(!document.location.pathname.startsWith('/cms/login'))
            document.location.href = '/cms/login';
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
            setData({
                username: '',
                pages: [],
                status: [
                    {
                        type: "warning",
                        message: err.message,
                    }
                ]
            })
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
                    <h1 className="text-gray-300 text-2xl">Hello, {data?.username}!</h1>
                    <p className="text-gray-300 text-lg">Welcome to Your website's admin panel</p>
                </div>
            </div>
        </main>
        <StatusMessages messages={data?.status}/>
        <RecentPages pages={data?.pages}/>
    </div>

}