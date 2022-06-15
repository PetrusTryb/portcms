import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import Component, {ComponentProps} from "./components/component";

type pageData = {
    id: string,
    components: Array<ComponentProps[keyof ComponentProps]>
}
const fetchData = new Promise<pageData>((resolve, reject) => {
    const preferredLanguage = navigator.language.split('-')[0];
    const currentPage = window.location.pathname.split('/')[1];
    fetch(`/api/pages/?url=${currentPage}&lang=${preferredLanguage}.json`).then(res => res.json().then(data => {
        if(data.error){
            switch (data.error.errorCode) {
                case 'MONGODB_URL_NOT_SET':
                case 'MONGODB_CONNECTION_ERROR':
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
                case 'MONGODB_DATABASE_NOT_FOUND':
                    resolve({
                        id: 'WELCOME', components: [
                            {
                                id: '1',
                                type: 'hero',
                                data: {
                                    title: 'Welcome to PortCMS!',
                                    subtitle: data.error.errorMessage,
                                    image: "https://images.unsplash.com/photo-1596443686812-2f45229eebc3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
                                }
                            },
                            {
                                id: '2',
                                type: 'auth',
                                data: {
                                    title: 'Create Your admin account to start using PortCMS',
                                    mode: 'register',
                                    disableLogin: true,
                                    disablePasswordReset: true,
                                }
                            }
                            ]
                    });
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
    </div>
  );
}

export default App;
