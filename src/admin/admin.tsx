import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import AdminPages from "./pages";
import PageSettings from "./pageSettings";
import React from "react";
import {Route, Routes} from "react-router-dom";
import AdminSettings from "./settings";
import UsersList from "./users";
import {ExclamationCircleIcon} from "@heroicons/react/solid";
import AccountSettings from "./accountSettings";

class Admin extends React.Component{
    render(){
        return <div className="h-screen overflow-hidden relative">
            <AdminSidebar/>
                <Routes>
                    <Route path="/" element={<AdminDashboard/>} />
                    <Route path="/pages" element={<AdminPages/>} />
                    <Route path="/pages/:pageId" element={<PageSettings/>} />
                    <Route path="/components" element={<div className="flex flex-col justify-center items-center h-full">
                        <ExclamationCircleIcon className="w-20 h-20 text-gray-400"/>
                        <h1 className="text-3xl font-bold text-gray-400">Custom components coming soon</h1>
                    </div>} />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/:userId" element={<AccountSettings/>} />
                    <Route path="/settings" element={<AdminSettings/>} />
                    <Route path="*" element={
                        <div className="flex flex-col items-center justify-center h-screen">
                            <ExclamationCircleIcon className="h-20 w-20 text-gray-400" aria-hidden="true" />
                            <h1 className="text-3xl font-bold text-gray-400">Error 404</h1>
                            <p className="text-xl text-gray-400">Page not found</p>
                            <a className="text-blue-500 hover:text-blue-600" href="/cms/admin/">Go to dashboard</a>
                        </div>
                    }/>
                </Routes>
        </div>
    }
}

export default Admin;