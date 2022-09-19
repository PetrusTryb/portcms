import LocalizedStringEditor, {localizedString} from "../util/localizedString";
import React from "react";
import {DocumentTextIcon} from "@heroicons/react/solid";
import Modal from "../components/modal";

interface PageSettingsProps {
    page?: Page
}
type Page = {
    url: string,
    metadata: {
        title: localizedString,
        description: localizedString,
    },
    position: number,
    visible: boolean
}
type PageSettingsState = {
    pageId?: string,
    pageData: Page,
    isModalOpen: boolean,
}

class PageSettings extends React.Component<PageSettingsProps, PageSettingsState> {
    constructor(props: PageSettingsProps) {
        super(props);
        const pageId = window.location.pathname.split('/').pop();
        this.state = {
            pageId: pageId !== "new"? pageId: undefined,
            pageData: {
                url: '',
                metadata: {
                    title: {},
                    description: {},
                },
                position: 0,
                visible: false,
            },
            isModalOpen: false,
        }
    }

    componentDidMount() {
        if (this.props.page) {
            this.setState({
                pageData: this.props.page,
            });
        } else if (this.state.pageId) {
            fetch(`/api/pages/?id=${this.state.pageId}`, {
                headers: {
                    'session': localStorage.getItem('session') || sessionStorage.getItem('session') || '',
                    'cache-control': 'no-cache',
                },
            }).then(res => res.json().then(response => {
                if (!response.error) {
                    this.setState({
                        pageData: response
                    });
                } else if (!document.location.pathname.startsWith('/cms/login'))
                    document.location.href = '/cms/login';
            }))
        }
    }

    submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let form = e.currentTarget;
        let formData = new FormData(form);
        let data = {
            "id": this.state.pageId,
            "url": formData.get("url") || "",
            "title": this.state.pageData.metadata.title,
            "description": this.state.pageData.metadata.description,
            "visible": formData.get("visible") === "on",
        };
        console.log(data);
        fetch(`/api/pages/`, {
            method: this.state.pageId ? 'POST' : 'PUT',
            headers: {
                "session": localStorage.getItem('session') || sessionStorage.getItem('session') || '',
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

    generateRandomUrl = () => {
        const url = btoa(Math.random().toString()).slice(5, 13);
        this.setState({
            pageData: {
                ...this.state.pageData,
                url: url,
            }
        })
    }

    render() {
        return <div className="w-full h-full flex flex-col ml-16">
            <Modal id="DEL" type="modal" data={{
                title: "Confirm delete",
                message: `Do You really want to delete this page? This cannot be undone.`,
                primaryAction: {
                    label: "Delete",
                    onClick: () => {
                        fetch(`/api/pages/${this.state.pageId}`, {
                            method: 'DELETE',
                            headers: {
                                "session": localStorage.getItem('session') || sessionStorage.getItem('session') || '',
                            },
                            body: JSON.stringify({
                                "id": this.state.pageId,
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
                    onClick: () => {
                        this.setState({
                            isModalOpen: false,
                        })
                    }
                }
            }} hidden={!this.state.isModalOpen}></Modal>
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
                                <DocumentTextIcon className="mr-2 h-5 w-5 inline"/>
                                {!this.state.pageId?"Please Fill All data before adding page":"Page properties"}
                            </h3>
                        </div>
                        <form onSubmit={this.submit}>
                            <div className="px-4 py-4">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="col-span-1">
                                        <label htmlFor="url"
                                               className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                            URL
                                        </label>
                                        <div className="mt-1 rounded-md shadow-sm">
                                            <input id="url" name="url" defaultValue={this.state.pageData?.url}
                                                   className="form-input inline-flex w-10/12 dark:bg-gray-800 dark:text-gray-100 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
                                            <button type="button" onClick={this.generateRandomUrl}
                                                className="inline-flex items-center w-2/12 py-2 rounded-r-md border border-r-0 border-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-900 px-3 text-sm text-gray-500">Random</button>
                                            <label htmlFor="url"
                                                   className="text-sm italic h-36px text-center leading-5 text-gray-700 dark:text-gray-400">
                                                Relative URL to the page.
                                                Example: <code>/</code>, <code>/about/</code>, <code>/contact/</code>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="title"
                                               className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                            Title
                                        </label>
                                        <div className="mt-1 rounded-md shadow-sm">
                                            <LocalizedStringEditor value={this.state.pageData?.metadata.title || {}} onChange={(e) => {
                                                this.setState({
                                                    pageData: {
                                                        ...this.state.pageData,
                                                        metadata: {
                                                            ...this.state.pageData.metadata,
                                                            title: e
                                                        }
                                                    }
                                                })
                                            }}/>
                                            <label
                                                className="text-sm italic h-36px text-center leading-5 text-gray-700 dark:text-gray-400">
                                                Title will be shown in browser's title bar and navbar
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="description"
                                               className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                            Description
                                        </label>
                                        <div className="mt-1 rounded-md shadow-sm">
                                            <LocalizedStringEditor value={this.state.pageData?.metadata.description || {}}
                                                                   onChange={(e) => this.setState({
                                                                       pageData: {
                                                                           ...this.state.pageData,
                                                                           metadata: {
                                                                               ...this.state.pageData.metadata,
                                                                               description: e
                                                                           }
                                                                       }
                                                                   })}/>
                                            <label
                                                className="text-sm italic h-36px text-center leading-5 text-gray-700 dark:text-gray-400">
                                                Will be shown in search engines, about 150-160 chars
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <label htmlFor="visible"
                                               className="block text-sm font-medium leading-5 text-gray-700 dark:text-gray-400">
                                            Visibility
                                        </label>
                                        <div className="mt-1 rounded-md shadow-sm">
                                            <input id="visible" checked={this.state.pageData?.visible||false} onChange={(event)=>this.setState({
                                                pageData:{
                                                    ...this.state.pageData,
                                                    visible: event.target.checked
                                                }
                                            })} name="visible"
                                                   type="checkbox"
                                                   className="form-checkbox h-4 w-4 text-accent2 transition duration-150 ease-in-out"/>
                                            <label htmlFor="visible"
                                                   className="ml-1 inline text-sm leading-5 text-gray-700 dark:text-gray-400">
                                                Make this page visible to all visitors of Your website
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-6 w-full h-20 bg-gray-50 dark:bg-gray-800">
                                {this.state.pageId &&
                                    <span className="inline-flex rounded-md shadow-sm">
                                <button onClick={() => this.setState({
                                    isModalOpen: true,
                                })} type="button"
                                        className="inline-flex items-center px-4 py-2 border-solid border border-black text-sm leading-5 font-medium rounded-md text-white dark:bg-red-800 bg-red-600 hover:bg-red-700 dark:hover:bg-red-900 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Delete this page
                                </button>
                            </span>
                                }
                                <span className="inline-flex rounded-md shadow-sm float-right">
                                <button type="submit"
                                        className="inline-flex items-center px-4 py-2 border-solid border border-[#e6e6e6] text-sm leading-5 font-medium rounded-md text-white dark:bg-dark bg-accent hover:bg-accent2 dark:hover:bg-black focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
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
}

export default PageSettings