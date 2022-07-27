import {useEffect, useState} from "react";
import RecentPages from "./recentPages";
import {AllPages} from "./allPages";
import {DocumentAddIcon} from "@heroicons/react/solid";

type pagesListState = {
    pages: Array<Page>,
    recentPages: Array<Page>,
}
export type Page ={
    _id: string,
    url: string,
    metadata: {
        title: string,
        description: string,
        createdAt: string,
        createdBy: string,
        updatedAt: string,
        updatedBy: string,
    },
    position: number,
    visible: boolean,
}
const fetchPagesList = new Promise<pagesListState>((resolve) => {
    const preferredLanguage = navigator.language.replace(/-\w+$/, '');
    if(!window.location.pathname.startsWith('/cms/admin/pages'))
        return;
    let data: pagesListState = {
        pages: [],
        recentPages: [],
    };
    fetch(`/api/pages?url=*&lang=${preferredLanguage}`,{
        headers: {
            'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
        },
    }).then(res => res.json().then(response => {
        let recent = [...response]
        if(!response.error) {
            data.pages = response.sort((a: Page, b: Page) => a.position - b.position);
            data.recentPages = recent.sort((a:Page, b:Page) => new Date(b.metadata.updatedAt).valueOf() - new Date(a.metadata.updatedAt).valueOf()).slice(0,3);
        }
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
            console.log(data);
            setData(data);
        }).catch(err => {
            console.error(err);
        }).finally(() => {
            console.log('finally');
        }
        )
    }, [])
    return <div className="w-full h-full flex flex-col ml-16">
        <header className="bg-white dark:bg-gray-400 shadow border-b border-solid">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 inline">Pages</h1>
            </div>
        </header>
        <main className="overflow-y-auto">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-4 sm:px-0">
                    <p className="dark:text-white text-dark text-lg">
                        Here You can add, edit, delete and publish pages of Your website.
                    </p>
                </div>
            </div>
            <RecentPages pages={data?.recentPages}/>
            <AllPages pages={data?.pages}/>
        </main>
        <a href="/cms/admin/pages/new" title="Create new page" className="fixed bottom-2 right-2 bg-accent hover:bg-[#00548b] text-white p-4 rounded-full m-2">
            <DocumentAddIcon className="w-8 h-8"/>
        </a>
    </div>
}