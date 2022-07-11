import {HomeIcon, ViewListIcon, InboxIcon, UsersIcon, CogIcon, ExternalLinkIcon, LogoutIcon} from '@heroicons/react/solid';

export default function AdminSidebar() {
    return (

        <aside className="w-16 float-left hover:w-64 transition-[width] duration-300 absolute h-full z-10" aria-label="Sidebar">
            <div className="overflow-y-auto overflow-x-hidden h-full py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                <ul className="space-y-2">
                    <li>
                        <a href="/cms/admin"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <HomeIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="/cms/admin/pages"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ViewListIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Pages</span>
                        </a>
                    </li>
                    <li>
                        <a href="/cms/admin/messages"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <InboxIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Messages</span>
                        </a>
                    </li>
                    <li>
                        <a href="/cms/admin/users"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <UsersIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Users</span>
                        </a>
                    </li>
                    <li>
                        <a href="/cms/admin/settings"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <CogIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Settings</span>
                        </a>
                    </li>
                    <hr className="border-b border-gray-200 dark:border-gray-700" />
                    <li>
                        <a href="/" target="_blank"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ExternalLinkIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Preview my website</span>
                        </a>
                    </li>
                    <li>
                        <a href="/cms/logout"
                           className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <LogoutIcon className="w-5 h-5" />
                            <span className="flex-1 ml-1 whitespace-nowrap overflow-x-hidden">Sign out</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    )
}