import {ClockIcon, EyeOffIcon} from "@heroicons/react/solid";
import React from "react";
import {Page} from "./pages";

export type RecentPagesProps = {
    pages?: Array<Page>,
}

class RecentPages extends React.Component<RecentPagesProps, {}> {
    render() {
        const {pages} = this.props;
        return <section>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-y-visible">
                <div className="bg-white dark:bg-gray-800 sm:rounded-lg shadow-[#dddddd] dark:shadow-black shadow-sm">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                            <ClockIcon className="mr-2 w-5 h-5 inline text-accent"/>
                            Recently edited pages
                        </h3>
                    </div>
                    <div className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-6 overflow-y-visible">
                            <ul>
                                {pages?.length?pages.map(page => <div key={page._id} className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                                    <a href={`/cms/admin/pages/${page._id}`} key={page._id}>
                                        <li className="border-gray-400 flex flex-row mb-2">
                                            <div
                                                className="select-none cursor-pointer bg-gray-200 dark:bg-gray-600 dark:text-gray-300 rounded-md flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                                                <div
                                                    className="flex flex-col rounded-md w-auto p-2 h-10 bg-gray-300 dark:bg-gray-700 justify-center items-center mr-4">{page.url}
                                                </div>
                                                <div className="flex-1 pl-1 mr-8">
                                                    <div className="font-medium">{page.metadata.title} {!page.visible?<EyeOffIcon className="h-4 w-4 inline text-info dark:text-[#9CA2AF]"/>:""}</div>
                                                    <div className="text-gray-600 dark:text-gray-400 text-sm">Last updated: {new Date(page.metadata.updatedAt).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </li>
                                    </a>
                                </div>):<div className="bg-white dark:bg-gray-600 shadow sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <a href="/cms/admin/pages/new">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white italic">
                                                You have no pages yet. Create one!
                                            </h3>
                                        </a>
                                    </div>
                                </div>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    }
}
export default RecentPages;