import React from 'react';
import './App.css';
import Component, {ComponentProps} from "./components/component";
import Cookies from "./components/cookies";
import AdminBar from "./admin/adminBar";
import Loader from "./components/loader";

type pageData = {
    _id: string,
    url?: string,
    components: Array<ComponentProps[keyof ComponentProps]>,
    metadata?: {
        title: string,
        description?: string,
        websiteTitle?: string
    }
    userData?: {
        _id: string,
        username: string,
        roles: Array<string>
    }
}

class App extends React.Component<{}, {data: pageData}> {
    constructor(props: {}) {
        super(props);
        this.state = {data: {_id: 'WAIT', components: []}};
    }
    error(st:number, msg:string){
        switch (st){
            case 50002:
                document.location.href = '/cms/install/';
                break;
            case 40401:
                document.location.href = '/cms/404/'
                break;
            default:
                return {
                    _id: 'Error #'+st,
                    components: [{
                        id: '0',
                        type: 'modal',
                        data: {
                            title: 'Error #'+st,
                            message: msg,
                            primaryAction: {
                                label: 'Reload',
                                onClick: () => window.location.search = '?forceReload=true'
                            },
                            secondaryAction: {
                                label: 'Login',
                                onClick: () => window.location.href = '/cms/login'
                            }
                        }
                    }]
                }
        }
    }
    fetchData = new Promise<pageData>((resolve) => {
        const preferredLanguage = navigator.language.split('-')[0];
        let currentPage = window.location.pathname;
        if(!currentPage.endsWith('/'))
            currentPage += '/';
        if(window.location.pathname.startsWith('/cms/logout')){
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
                    window.location.href = "/?forceReload=true";
                    localStorage.removeItem('session');
                    sessionStorage.removeItem('session');
                }
                else {
                    resolve(this.error(response.error.errorCode, response.error.errorMessage) as pageData);
                }
            })).catch(err => {
                resolve(this.error(1, err.message) as pageData);
            })
            return;
        }
            const lastReload = sessionStorage.getItem('lastReload')?.split(';').includes(currentPage);
            const shouldReload = window.location.search.includes('forceReload=true') || !lastReload;
            fetch(`/api/pages/?url=${currentPage}&lang=${preferredLanguage}`,{
                headers: {
                    'session': localStorage.getItem('session')||sessionStorage.getItem('session')||'',
                    'cache-control': shouldReload?'no-cache':''
                }
            }).then(res => res.json().then(data => {
                if(shouldReload)
                    sessionStorage.setItem('lastReload', (sessionStorage.getItem('lastReload')||'') + currentPage + ';');
                if(data.error){
                    resolve(this.error(data.error.errorCode, data.error.errorMessage) as pageData);
                }
                if(window.location.search.includes('forceReload'))
                    window.location.search = '';
                resolve(data);
            })).catch(err => {
                resolve(this.error(2, err.message) as pageData);
            });
    })
    componentDidMount() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("/sw.js",{
                scope: '/'
            }).then(() => {
                this.fetchData.then(data => this.setState({data}));
            });
        }
        else
            this.fetchData.then(data => this.setState({data}));
    }
    render() {
        if(this.state.data._id==="WAIT")
            return <Loader/>;
        else {
            document.title=`${this.state.data.metadata?.title||this.state.data.url||this.state.data._id} | ${this.state.data.metadata?.websiteTitle||document.location.hostname}`
            if (this.state.data.metadata?.description)
                document.querySelector('meta[name="description"]')?.setAttribute("content", this.state.data.metadata.description);
            return (
                <div className="App" id="MainDiv" data-page={this.state.data._id}>
                    {this.state.data.components.map((component) => (
                        <Component key={component.id} userData={this.state.data.userData} {...component}/>
                    ))}
                    <Cookies/>
                    {this.state.data.userData?.roles.includes('admin') && <AdminBar pageData={this.state.data}/>}
                </div>
            );
        }
    }
}

export default App;
