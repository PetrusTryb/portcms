import AdminSidebar from "./sidebar";
import AdminDashboard from "./dashboard";

function getPage(){
    switch (document.location.pathname.split("/")[3]){
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