import React, { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {MenuIcon, XIcon, UserIcon } from '@heroicons/react/outline'

export type NavbarProps = {
    id: string,
    type: "navbar",
    data: {
        logo?: string,
        smallLogo?: string,
        pages: Array<
            {
                id: string,
                name: string,
                url: string
            }
        >,
        user?: {
            username: string,
            roles: string,
        }
    },
    userData?: {
        _id: string,
        username: string,
        roles: string[],
    }
}

class Navbar extends React.Component<NavbarProps, {}> {
    classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }
    render() {
        let currentPage = window.location.pathname
        return (
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0 flex items-center">
                                        {this.props.data.smallLogo && (
                                            <img
                                                className="block lg:hidden h-8 w-auto"
                                                src={this.props.data.smallLogo}
                                                alt="Small logo"
                                            />
                                        )}
                                        {this.props.data.logo && (
                                            <img
                                                className="hidden lg:block h-8 w-auto"
                                                src={this.props.data.logo}
                                                alt="Logo"
                                            />)}
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex space-x-4">
                                            {this.props.data.pages.map((item) => (
                                                <a
                                                    key={item.name}
                                                    href={item.url}
                                                    className={this.classNames(
                                                        item.url===currentPage ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                    aria-current={item.url===currentPage ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="ml-3 relative z-30">
                                        <div>
                                            {this.props.data.user && (
                                            <Menu.Button className="bg-gray-800 text-[#23fd00] flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                <span className="sr-only">Open user menu</span>
                                                <UserIcon className="h-6 w-6" aria-hidden="true"/>
                                            </Menu.Button>
                                            )}
                                            {!this.props.data.user && (
                                                <Menu.Button className="bg-gray-800 text-gray-400 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                    <span className="sr-only">Open user menu</span>
                                                    <UserIcon className="h-6 w-6" aria-hidden="true"/>
                                                </Menu.Button>
                                            )}
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {this.props.data.user?.roles.includes("admin") && (
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="/cms/admin"
                                                                className={this.classNames(active ? 'bg-gray-100 dark:bg-gray-900' : '', 'block px-4 py-2 text-sm text-[#8A2BE2] h-36px')}
                                                            >
                                                                Admin dashboard
                                                            </a>
                                                        )}
                                                    </Menu.Item>)}
                                                {this.props.data.user && (
                                                    <div>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/cms/account"
                                                                    className={this.classNames(active ? 'bg-gray-100 dark:bg-gray-900' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-400')}
                                                                >
                                                                    Your Profile
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/cms/settings"
                                                                    className={this.classNames(active ? 'bg-gray-100 dark:bg-gray-900' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-400')}
                                                                >
                                                                    Settings
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <a
                                                                    href="/cms/logout"
                                                                    className={this.classNames(active ? 'bg-gray-100 dark:bg-gray-900' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-400')}
                                                                >
                                                                    Sign out
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>)}
                                                {!this.props.data.user && (
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="/cms/login"
                                                                className={this.classNames(active ? 'bg-gray-100 dark:bg-gray-900' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-400')}
                                                            >
                                                                Sign in
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                )}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {this.props.data.pages.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.url}
                                        className={this.classNames(
                                            item.url===currentPage ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium'
                                        )}
                                        aria-current={item.url===currentPage ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        )
    }
}

export default Navbar