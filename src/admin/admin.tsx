import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import AdminPages from "./pages";
import PageSettings from "./pageSettings";
import React from "react";
import {Route, Routes} from "react-router-dom";

class Admin extends React.Component{
    render(){
        return <div className="h-screen overflow-hidden relative">
            <AdminSidebar/>
                <Routes>
                    <Route path="/" element={<AdminDashboard/>} />
                    <Route path="/pages" element={<AdminPages/>} />
                    <Route path="/pages/:pageId" element={<PageSettings/>} />
                </Routes>
        </div>
    }
}

export default Admin;