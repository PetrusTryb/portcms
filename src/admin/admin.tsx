import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import AdminPages from "./pages";
import PageSettings from "./pageSettings";
import React from "react";
import {Route, Routes} from "react-router-dom";
import AdminSettings from "./settings";

class Admin extends React.Component{
    render(){
        return <div className="h-screen overflow-hidden relative">
            <AdminSidebar/>
                <Routes>
                    <Route path="/" element={<AdminDashboard/>} />
                    <Route path="/pages" element={<AdminPages/>} />
                    <Route path="/pages/:pageId" element={<PageSettings/>} />
                    <Route path="/messages" element={<p className="flex items-center justify-center min-h-screen w-full italic text-info">This section is reserved for future use</p>} />
                    <Route path="/users" element={<p className="flex items-center justify-center min-h-screen w-full italic text-info">Users management coming soon</p>} />
                    <Route path="/settings" element={<AdminSettings/>} />
                </Routes>
        </div>
    }
}

export default Admin;