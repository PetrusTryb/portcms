import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import AdminPages from "./pages";
import PageSettings from "./pageSettings";

function getPage(){
    switch (document.location.pathname.split("/")[3]){
        case "pages":
            if (document.location.pathname.split("/")[4] === "new")
                return <PageSettings/>;
            else if (document.location.pathname.split("/")[4]?.length === 24)
                return <PageSettings pageId={document.location.pathname.split("/")[4]}/>;
            return <AdminPages />;
        default:
            return <AdminDashboard/>;
    }
}

function Admin(){
    return <div className="h-screen overflow-hidden relative">
        <AdminSidebar/>
        {getPage()}
    </div>
}
export default Admin;