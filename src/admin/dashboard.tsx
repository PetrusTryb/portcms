import {useEffect, useState} from "react";
import {StatusMessages, StatusMessage} from "./statusMessages";
import RecentPages from "./recentPages";
import {Page} from "./pages";

type dashboardState = {
    username: string,
    recentPages: Array<Page>,
    status: Array<StatusMessage>
}

const fetchDashboardData = new Promise<dashboardState>((resolve) => {
    if(!window.location.pathname.includes('cms/admin'))
        return;
    const preferredLanguage = navigator.language.replace(/-\w+$/, '');
    let data: dashboardState = {
        username: '',
        recentPages: [],
        status: [],
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
        fetch(`/api/pages?url=*&lang=${preferredLanguage}`,{
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
            }
        }).then(res => res.json().then(response => {
            if(!response.error) {
                if(response.length > 0) {
                    data.recentPages = response.sort((a: Page, b: Page) => new Date(b.metadata.updatedAt).valueOf() - new Date(a.metadata.updatedAt).valueOf()).slice(0, 3);
                    let homePage = response.find((page: Page) => page.url === '/');
                    if(homePage?.visible)
                        data.status.push({
                            type: 'success',
                            message: 'Your site is live at: ' + window.location.origin,
                            link: window.location.origin,
                        })
                    else if(homePage){
                        data.status.push({
                            type: 'warning',
                            message: 'Your site is not live yet. Please publish your home page - set it to be visible.',
                            link: window.location.origin + '/cms/admin/pages/' + homePage._id,
                        })
                    }
                    else{
                        data.status.push({
                            type: 'warning',
                            message: 'Your site is not live yet - You don\'t have a homepage. Please add a page with the url "/"',
                            link: '/cms/admin/pages/new',
                        })
                    }
                    if(!response.find((page:Page) => page.url==="*")){
                        data.status.push({
                            type: 'warning',
                            message: 'Website name is not set. Please set it in the settings.',
                            link: '/cms/admin/settings',
                        })
                    }
                }
                else
                    data.status.push(
                    {
                        type: 'success',
                        message: 'Installation complete!',
                    },
                    {
                        type: 'warning',
                        message: "You don't have any pages yet. Create one now!",
                        link: '/cms/admin/pages/new',
                    },
                    {
                        type: 'warning',
                        message: 'Website name is not set. Please set it in the settings.',
                        link: '/cms/admin/settings',
                    });
            }
            else{
                console.error(response);
            }
            resolve(data);
        })).catch(err => {
            console.error(err);
            resolve(data);
        }
        )
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
            console.error(err);
        }).finally(() => {
            console.log('finally');
        })
    }, [])
    return <div className="w-full h-full flex flex-col ml-16">
        <header className="bg-neutral-100 dark:bg-gray-400 shadow-[0_0_4px_rgba(0,0,0,0.0884)]">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-black opacity-[.87] inline">Dashboard</h1>
            </div>
        </header>
        <main className="overflow-y-auto w-full block ml-auto mr-auto box-border pl-16 pr-16">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    <h1 className="text-accent dark:text-white text-2xl">Hello, {data?.username}!</h1>
                    <p className="text-gray-300 text-lg">Welcome to Your website's admin panel</p>
                </div>
            </div>
            <StatusMessages messages={data?.status}/>
            <RecentPages pages={data?.recentPages}/>
        </main>
    </div>

}