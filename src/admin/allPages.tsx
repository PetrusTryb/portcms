import {ViewListIcon, ArrowUpIcon, ArrowDownIcon, EyeOffIcon} from "@heroicons/react/solid";
import React from "react";

type AllPagesProps = {
    pages?: Array<Page>
}
type Page ={
    _id: string,
    url: string,
    metadata: {
        title: string,
        updatedAt: string,
    },
    visible: boolean,
}

class AllPages extends React.Component<AllPagesProps>{
    swapPositions = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        let button = event.currentTarget;
        let id1 = button.dataset.id1;
        let id2 = button.dataset.id2;
        if(id1 && id2) {
            fetch(`/api/pages/`, {
                method: 'PATCH',
                headers: {
                    'session': localStorage.getItem('session')||sessionStorage.getItem('session')||'',
                },
                body: JSON.stringify({
                    id1: id1,
                    id2: id2,
                })
            }).then(res => res.json().then(response => {
                if(!response.error) {
                    window.location.reload();
                }
            })).catch(err => {
                console.error(err);
            })
        }
    }
    render(){
        const {pages} = this.props;
        if(!pages) return null;
        return <section>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 sm:rounded-lg shadow-black shadow-sm">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                            <ViewListIcon className="mr-2 w-5 h-5 inline text-accent"/>
                            All pages
                        </h3>
                    </div>
                    <div className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-6">
                            <ul>
                                {pages?.length?pages.map((page, index, array) => <div key={page._id} className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                                    <a href={`/cms/admin/pages/${page._id}`} key={page._id}>
                                        <li className="border-gray-400 flex flex-row mb-2">
                                            <div
                                                className="select-none cursor-pointer bg-white dark:bg-gray-600 dark:text-gray-300 rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                                                <div
                                                    className="flex flex-col rounded-md w-auto p-2 h-10 bg-gray-300 dark:bg-gray-700 justify-center items-center mr-4 border-solid border border-opacity-[12%] border-black">{page.url}
                                                </div>
                                                <div className="flex-1 pl-1 mr-8">
                                                    <div className="font-medium">{page.metadata.title} {!page.visible?<EyeOffIcon className="h-4 w-4 inline text-accent dark:text-[#E0E0E0]"/>:""}</div>
                                                </div>
                                                <div className="flex flex-col text-gray-600 dark:text-gray-400 text-xs">
                                                    {/*Disable move up button when index = 0 and move down button when length of array - index = 1*/}
                                                    <button onClick={this.swapPositions} title="Move this page Left in the navigation" data-id1={page._id} data-id2={array.at(index-1)?._id} disabled={index===0} className="disabled:opacity-disabled disabled:transform-none active:opacity-0 mb-1 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded-md p-1 transition duration-500 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg">
                                                        <ArrowUpIcon className="w-5 h-5 inline"/>
                                                    </button>
                                                    <button onClick={this.swapPositions} title="Move this page Right in the navigation" data-id1={page._id} data-id2={array.at(index+1)?._id} disabled={index+1===array.length} className="disabled:opacity-disabled disabled:transform-none active:opacity-0 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded-md p-1 transition duration-500 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg">
                                                        <ArrowDownIcon className="w-5 h-5 inline"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    </a>
                                </div>):<div></div>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }
}

export default AllPages;