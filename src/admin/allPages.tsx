import {ViewListIcon} from "@heroicons/react/solid";

type AllPagesProps = {
    pages?: Array<Page>,
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
export const AllPages = (props: AllPagesProps) => {
    return <section>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                        <ViewListIcon className="mr-2 w-5 h-5 inline"/>
                        All pages
                    </h3>
                </div>
                <div className="px-4 py-4">

                </div>
            </div>
        </div>
    </section>
}