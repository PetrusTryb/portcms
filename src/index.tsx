import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './admin/admin';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./components/auth";
import "react-quill/dist/quill.bubble.css";
import {
    CodeIcon,
    XCircleIcon,
    InformationCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/solid";
import AccountSettings from "./admin/accountSettings";
import {ErrorBoundary} from "react-error-boundary";
import Hero from "./components/hero";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <ErrorBoundary fallback={<div className="flex flex-col items-center justify-center h-screen">
          <XCircleIcon className="h-20 w-20 text-gray-400" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-gray-400">Critical error</h1>
          <p className="text-gray-400">
              Something went wrong. Please try again later.<br/>
              If the problem persists, report issue on <a href="https://github.com/PetrusTryb/portcms" target="_blank" rel="noreferrer" className="text-blue-500">GitHub</a>.
          </p>
          <a className="text-blue-500 hover:text-blue-600" href="?forceReload=true">Reload</a>
      </div>}>
    <div className={navigator.onLine?"hidden":"bg-red-800"}>
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-red-900 p-2">
              <InformationCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 truncate font-medium text-white">
                                            <span className="md:hidden">
                                                No internet connection
                                            </span>
              <span className="hidden md:inline">
                                                You are offline. Showing cached content.
                                            </span>
            </p>
          </div>
        </div>
      </div>
    </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} >
            <Route path=":pageUrl"></Route>
          </Route>
          <Route path="/cms/" >
            <Route path="admin/*" element={<Admin/>} />
            <Route path="install" element={
                <div>
                <Hero id="1" type="hero" data={{
                    title: "Install PortCMS",
                    subtitle: "PortCMS is not installed.",
                    image: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                }}/>
                <Auth data={{
                title: 'Create Your admin account to get started',
                mode: 'register',
                disableLogin: true,
                disablePasswordReset: true,
                }}/></div>
            }/>
            <Route path="login" element={<Auth data={{"mode":"login", "title":"Log in to PortCMS"}}/>}/>
            <Route path="register" element={<Auth data={{"mode":"register", "title":"Register to PortCMS"}}/>}/>
            <Route path="reset_password" element={<Auth data={{"mode":"reset", "title":"Account recovery"}}/>}/>
            <Route path="logout" element={<App/>} />
            <Route path="account" element={<AccountSettings/>} />
            <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-screen">
                    <ExclamationCircleIcon className="h-20 w-20 text-gray-400" aria-hidden="true" />
                    <h1 className="text-3xl font-bold text-gray-400">Error 404</h1>
                    <p className="text-xl text-gray-400">Page not found</p>
                    <a className="text-blue-500 hover:text-blue-600" href="/">Go to home page</a>
                </div>
            }/>
              <Route path="" element={
                <div className="flex flex-col items-center justify-center h-screen">
                    <CodeIcon className="h-20 w-20 text-gray-400" aria-hidden="true" />
                    <h1 className="text-3xl font-bold text-gray-400">PortCMS 2.0</h1>
                    <p className="text-xl text-gray-400">Visit <a href="https://github.com/PetrusTryb/portcms" target="_blank" rel="noreferrer" className="text-blue-500">GitHub</a> to learn more!</p>
                </div>
              }/>
          </Route>
        </Routes>
      </BrowserRouter>
      </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
