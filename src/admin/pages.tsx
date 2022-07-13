import {useEffect, useState} from "react";
import RecentPages from "./recentPages";
import {AllPages} from "./allPages";
import {DocumentAddIcon} from "@heroicons/react/solid";

type pagesListState = {
    pages: Array<Page>,
    recentPages: Array<Page>,
}
type Page ={
    id: string,
    url: string,
    title: string,
    author: string,
    modified: string,
    visible: boolean,
    position: number,
}
const fetchPagesList = new Promise<pagesListState>((resolve) => {
    if(!window.location.pathname.startsWith('/cms/admin/pages'))
        return;
    let data: pagesListState = {
        pages: [],
        recentPages: [],
    }
    fetch('/api/pages?url=*',{
        headers: {
            'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
        },
    }).then(res => res.json().then(response => {
        if(!response.error)
            data.pages = response.pages;
        else if(!document.location.pathname.startsWith('/cms/login'))
            document.location.href = '/cms/login';
        resolve(data);
    })).catch(err => {
        console.log(err);
    }
    )
})
export default function AdminPagesList(){
    let [data, setData] = useState<pagesListState>();
    useEffect(() => {
        fetchPagesList.then(data => {
            setData(data);
        }).catch(err => {
            console.error(err);
            setData({
                pages: [],
                recentPages: [],
            })
        }).finally(() => {
            console.log('finally');
        }
        )
    }, [])
    return <div className="relative ml-16">
        <header className="bg-white dark:bg-gray-400 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 inline">Pages</h1>
            </div>
        </header>
        <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    <p className="text-gray-300 text-lg">
                        Here You can add, edit, delete and publish pages of Your website.
                    </p>
                </div>
            </div>
        </main>
        <RecentPages pages={data?.pages}/>
        <AllPages pages={data?.pages}/>
        <a href="/cms/pages/new" title="Create new page" className="fixed bottom-0 right-0 bg-green-600 text-white p-4 rounded-full hover:bg-green-800 m-2">
            <DocumentAddIcon className="w-8 h-8"/>
        </a>
    </div>
}