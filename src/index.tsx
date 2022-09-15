import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Admin from './admin/admin';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "./components/auth";
import "react-quill/dist/quill.bubble.css";
import {ShieldExclamationIcon} from "@heroicons/react/solid";
import AccountSettings from "./admin/accountSettings";
import {XCircleIcon} from "@heroicons/react/outline";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className={navigator.onLine?"hidden":"bg-red-800"}>
      <div className="mx-auto max-w-7xl py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <span className="flex rounded-lg bg-red-900 p-2">
              <XCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
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
            <Route path="login" element={<Auth id="auth" type="auth" data={{"mode":"login", "title":"Log in to PortCMS"}}/>}/>
            <Route path="logout" element={<App/>} />
            <Route path="account" element={<AccountSettings/>} />
            <Route path="*" element={<p className="flex items-center justify-center min-h-screen w-full italic text-info"><ShieldExclamationIcon className="w-5 h-5"/>Invalid Directory!</p>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
