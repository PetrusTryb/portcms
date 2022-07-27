import LocalizedStringEditor, {localizedString} from "../util/localizedString";
import React, {useEffect, useState} from "react";
import {ArchiveIcon} from "@heroicons/react/solid";
import Modal from "../components/modal";

type PageSettingsProps = {
    page?: Page,
    pageId?: string,
}
type Page = {
    url: string,
    metadata: {
        title: localizedString,
        description: localizedString,
        createdAt: string,
        createdBy: string,
        updatedAt: string,
        updatedBy: string,
    },
    position: number,
    visible: boolean,
}

function fetchPageData(pageId: string) {
    return new Promise<Page>((resolve) => {
        if(!pageId) {
            resolve({
                url: '',
                metadata: {
                    title: {},
                    description: {},
                    createdAt: '',
                    createdBy: '',
                    updatedAt: '',
                    updatedBy: '',
                },
                position: 0,
                visible: false
            });
            return;
        }
        fetch(`/api/pages/?id=${pageId}`,{
            method: 'GET',
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
            },
        }).then(res => res.json().then(response => {
            if(!response.error)
                resolve(response);
            else if(response.statusCode==="403"&&!document.location.pathname.startsWith('/cms/login'))
                document.location.href = '/cms/login';
        })).catch(err => {
            console.log(err);
        }
        )
    }
    )
}

export default function PageSettings(props: PageSettingsProps) {
    let session = localStorage.getItem("session")||sessionStorage.getItem("session")||"";
    let [title, setTitle] = useState<localizedString>({});
    let [description, setDescription] = useState<localizedString>({});
    let [page, setPage] = useState<Page>();
    let [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
            fetchPageData(props.pageId||"").then(page => {
                setPage(page);
                setTitle(page.metadata.title);
                setDescription(page.metadata.description);
            }).catch(err => {
                console.log(err);
            }
            )
    },[props.pageId]);
    let submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.currentTarget;
        let formData = new FormData(form);
        let data = {
            "id": props.pageId,
            "url": formData.get("url") || "",
            "title": title,
            "description": description,
            "visible": formData.get("visible") === "on",
        };
        console.log(data);
        fetch(`/api/pages/`, {
            method: props.pageId ? 'POST' : 'PUT',
            headers: {
                "session": session,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.location.href = "/cms/admin/pages/";
            } else {
                console.log("error");
            }
        }).catch(error => {
            console.log(error);
        })
    }
    return <div className="w-full h-full flex flex-col ml-16">
        <Modal id="DEL" type="modal" data={{
            title:"Confirm delete",
            message: `Do You really want to delete this page? This cannot be undone.`,
            primaryAction: {
                label: "Delete",
                onClick: () => {
                    fetch(`/api/pages/${props.pageId}`, {
                        method: 'DELETE',
                        headers: {
                            "session": session,
                        },
                        body: JSON.stringify({
                            "id": props.pageId,
                        })
                    }).then(response => {
                        if (response.ok) {
                            window.location.href = "/cms/admin/pages/";
                        } else {
                            console.log("error");
                        }
                    }).catch(error => {
                        console.log(error);
                    }
                    )
                }
            },
            secondaryAction: {
                label: "Cancel",
                onClick: () => {setIsModalOpen(false)}
            }}} hidden={!isModalOpen}></Modal>
        <header className="bg-white dark:bg-gray-400 shadow">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 inline">Page properties</h1>
            </div>
        </header>
        <main className="overflow-y-auto">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 sm:rounded-lg shadow-[0_1px_1px_0_rgba(0,0,0,0.12)]">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400 inline">
                            <ArchiveIcon className="mr-2 h-5 w-5 text-accent inline" />
                            Metadata
                        </h3>
                    </div>
                    <form onSubmit={submit}>
                    <div className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="col-span-1">
                                <label htmlFor="url" className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                    URL
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input id="url" name="url" defaultValue={page?.url} className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" />
                                    <label htmlFor="url" className="block text-sm leading-5 text-gray-700 dark:text-gray-400">
                                        Relative URL to the page. Example: /about/, /contact/, /blog/
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="title" className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                    Title
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <LocalizedStringEditor value={page?.metadata.title||{}} onChange={(e)=>{setTitle(e)}}/>
                                    <label className="block text-sm leading-5 text-gray-700 dark:text-gray-400">
                                        The title of the page. You can provide a localized string here. Select the language you want to edit from the dropdown.
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="description" className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                    Description
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <LocalizedStringEditor value={page?.metadata.description||{}} onChange={(e)=>setDescription(e)}/>
                                    <label className="block text-sm leading-5 text-gray-700 dark:text-gray-400">
                                        The description of the page, which will be shown in search engines. You can provide a localized string here. Select the language you want to edit from the dropdown.<br/>Recommended length: 50-160 characters.
                                    </label>
                                </div>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="visible" className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                    Visibility
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <input id="visible" defaultChecked={page?.visible} name="visible" type="checkbox" className="form-checkbox h-4 w-4 text-accent2 transition duration-150 ease-in-out" />
                                    <label htmlFor="visible" className="ml-1 inline text-sm leading-5 text-gray-700 dark:text-gray-400">
                                        Make this page visible to all visitors of Your website (You can change this later in the page settings).
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div className="px-4 py-6 w-full h-20 bg-gray-50 dark:bg-gray-800">
                            {props.pageId &&
                                <span className="inline-flex rounded-md shadow-sm">
                                <button onClick={()=>setIsModalOpen(true)} type="button"
                                        className="inline-flex items-center px-4 py-2 border-solid border border-black text-sm leading-5 font-medium rounded-md text-white dark:bg-red-800 bg-red-600 hover:bg-red-700 dark:hover:bg-red-900 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Delete this page
                                </button>
                            </span>
                            }
                            <span className="inline-flex rounded-md shadow-sm float-right">
                                <button type="submit" className="inline-flex items-center px-4 py-2 border-solid border border-[#e6e6e6] text-sm leading-5 font-medium rounded-md text-white dark:bg-dark bg-accent hover:bg-accent2 dark:hover:bg-black focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Save changes
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>


}