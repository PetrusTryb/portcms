import React, {useEffect, useState} from 'react';
import './App.css';
import Component, {ComponentProps} from "./components/component";
import Cookies from "./components/cookies";

type pageData = {
    id: string,
    components: Array<ComponentProps[keyof ComponentProps]>,
    user?: {
        username: string,
        sessionId: string
    }
}
const fetchData = new Promise<pageData>((resolve) => {
    const preferredLanguage = navigator.language.split('-')[0];
    const currentPage = window.location.pathname.split('/')[1];
    if(window.location.pathname.startsWith('/cms/login')){
        resolve({
            id: 'login',
            components: [{
                id: 'login',
                type: 'auth',
                data: {
                    title: 'Sign in',
                    mode: 'login',
                }
            }],
        });
    }
    else if(window.location.pathname.startsWith('/cms/logout')){
        fetch('/api/auth',{
            method: 'POST',
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
            },
            body: JSON.stringify({
                mode: 'logout',
            })
        }).then(res => res.json().then(response => {
            if(!response.error) {
                document.location.href = '/';
                localStorage.removeItem('session');
                sessionStorage.removeItem('session');
            }
            else {
                console.log(response.error);
                resolve({
                    id: 'ERR',
                    components: [{
                        id: 'ERR',
                        type: 'modal',
                        data: {
                            title: 'Could not log out',
                            message: response.error.errorMessage,
                            primaryAction:{
                                label: 'Clear storage',
                                onClick: () => {
                                    localStorage.removeItem('session');
                                    sessionStorage.removeItem('session');
                                    document.location.href = '/';
                                }
                            }
                        }
                    }],
            })
            }
        })).catch(err => {
            resolve({
                id: 'ERR',
                components: [{
                    id: 'ERR',
                    type: 'modal',
                    data: {
                        title: 'Could not log out',
                        message: err.message,
                        primaryAction:{
                            label: 'Try again',
                            onClick: () => {
                                document.location.reload()
                            }
                        },
                        secondaryAction:{
                            label: 'Clear storage',
                            onClick: () => {
                                localStorage.removeItem('session');
                                sessionStorage.removeItem('session');
                                document.location.href = '/';
                            }
                        }
                    }
                }],
            })
        })
    }
    if(currentPage!=='cms')
    fetch(`/api/pages/?url=${currentPage}&lang=${preferredLanguage}`).then(res => res.json().then(data => {
        if(data.error){
            switch (data.error.errorCode) {
                case 50001:
                    resolve({id: 'ERROR', components: [
                        {
                            id: 'error',
                            type: 'hero',
                            data: {
                                title: 'Error',
                                subtitle: data.error.errorMessage,
                                image: "https://images.unsplash.com/photo-1505776777247-d26acc0e505b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
                            }
                        }
                    ]});
                    break;
                case 50002:
                    resolve({
                        id: 'WELCOME', components: [
                            {
                                id: '1',
                                type: 'hero',
                                data: {
                                    title: 'Hello World',
                                    subtitle: data.error.errorMessage,
                                    image: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                                }
                            },
                            {
                                id: '2',
                                type: 'auth',
                                data: {
                                    title: 'Create Your admin account to get started',
                                    mode: 'register',
                                    disableLogin: true,
                                    disablePasswordReset: true,
                                }
                            }
                            ]
                    });
                    break;
                case 40401:
                    if(currentPage===''){
                        document.location.href="/cms/admin";
                    }
                    else{
                        resolve({id: 'ERROR', components: [
                            {
                                id: 'error',
                                type: 'hero',
                                data: {
                                    title: 'Error 404',
                                    subtitle: data.error.errorMessage,
                                    image: "https://images.unsplash.com/photo-1505776777247-d26acc0e505b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
                                }
                            }
                        ]});
                    }
            }
        }
        resolve(data);
    })).catch(err => {
        console.error(err);
        resolve({id: 'ERR', components: [
            {
                id: 'ERR',
                type: "modal",
                data: {
                    title: "Error",
                    message: "Something went wrong. Please try again later.",
                    primaryAction: {
                        label: "Reload",
                        onClick: () => window.location.reload()
                    }
                }
            }
            ]});
    });
})

function App() {
    const [data, setData] = useState<pageData>({id: 'WAIT', components: []});
    useEffect(() => {
        fetchData.then(data => setData(data));
    }, []);
  return (
    <div className="App">
        {data.components.map((component) => (
            <Component key={component.id} {...component} />
        ))}
        <Cookies />
    </div>
  );
}

export default App;
