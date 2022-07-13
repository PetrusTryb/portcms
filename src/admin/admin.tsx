import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";
import AdminPages from "./pages";

function getPage(){
    switch (document.location.pathname.split("/")[3]){
        case "pages":
            return <AdminPages />;
        default:
            return <AdminDashboard/>;
    }
}

function Admin(){
    return <div>
        <AdminSidebar/>
        <div>
            {getPage()}
        </div>
    </div>
}
export default Admin;