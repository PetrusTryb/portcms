import {ClockIcon} from "@heroicons/react/solid";

export type RecentPagesProps = {
    pages?: Page[],
}
export type Page ={
    id: string,
    url: string,
    title: string,
}
export default function RecentPages(props: RecentPagesProps){
    return <section>
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
                        {props.pages?.length?props.pages.map(page => <div key={page.id} className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
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
                                <a href="/cms/admin/pages/new">
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
}