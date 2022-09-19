import React from "react";

type footerProps = {
    lastLogin: Date,
}

class AdminFooter extends React.Component<footerProps, {}>{
    render(){
        return (
            <footer className="-mx-16 py-6 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-600">
                <div className="px-4 py-4 sm:px-0">
                    <p className="text-black dark:text-gray-300 text-xl font-black">PortCMS v2.0</p>
                    <p className="text-black dark:text-gray-300 text-lg">
                        Made with <span className="text-red-500">❤</span> by <a href="https://github.com/PetrusTryb/" rel="noreferrer" className="text-accent dark:text-accent2" target="_blank">Piotr T.</a>
                    </p>
                    <p className="text-black dark:text-gray-300 text-sm">
                        Last login: {this.props.lastLogin.toLocaleString()}
                    </p>
                    <p className="text-black dark:text-gray-300 text-sm">
                        Session ID: {(localStorage.getItem('session')||sessionStorage.getItem('session')||'').replace(/^(.{4})(.*)(.{4})$/, '$1...$3')}
                    </p>
                    <p className="text-black dark:text-gray-300 text-xs">
                        To view all sessions, that are currently active, go to <a href="/cms/account" className="text-accent dark:text-accent2">Your Profile</a> page.
                    </p>
                </div>
            </footer>
        )
    }
}

export default AdminFooter;