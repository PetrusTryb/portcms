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
        let ans = {
            _id: 'Error #'+st,
            components: [{
                id: '0',
                type: 'modal',
                data: {}
            }]
        }
        switch (st){
            case 50001:
                ans.components[0].data = {
                    title: 'Database connection error',
                    message: msg,
                    primaryAction: {
                        label: 'Reload',
                        onClick: () => window.location.reload()
                    },
                    secondaryAction: {
                        label: 'Report issue',
                        onClick: () => window.open("https://github.com/PetrusTryb/portcms/issues")
                    }
                }
                break;
            case 50002:
                ans.components= [
                {
                    id: '1',
                    type: 'hero',
                    data: {
                        title: 'Hello World',
                        subtitle: msg,
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
                break;
            case 40401:
                ans.components[0].data = {
                    title: 'Sorry, we are unable to display this page',
                    message: msg,
                    primaryAction: {
                        label: 'Log in to admin panel',
                        onClick: () => window.location.href = "/cms/admin/"
                    },
                    secondaryAction:{
                        label: 'Go to homepage',
                        onClick: () => window.location.href = '/'
                    }
                }
                break;
            case 50301:
                ans.components[0].data = {
                    title: "Website under maintenance",
                    message: msg,
                    primaryAction: {
                        label: 'Disable maintenance mode',
                        onClick: () => window.location.href = "/cms/admin/settings"
                    },
                    secondaryAction: {
                        label: 'Reload',
                        onClick: () => window.location.reload()
                    },
                }
                break;
            default:
                ans.components[0].data = {
                    title: 'Error #'+st,
                    message: "An error occurred while loading this page. Please try again later.",
                    primaryAction: {
                        label: 'Reload',
                        onClick: () => window.location.reload()
                    },
                    secondaryAction: {
                        label: 'Ignore',
                        onClick: () => console.log('Ignoring error')
                    }
                }
        }
        console.log(st,ans);
        return ans;
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
                    document.location.href = '/';
                    localStorage.removeItem('session');
                    sessionStorage.removeItem('session');
                }
                else {
                    resolve(this.error(response.error.errorCode, response.error.errorMessage) as pageData);
                }
            })).catch(err => {
                resolve(this.error(1, err.message) as pageData);
            })
        }
            fetch(`/api/pages/?url=${currentPage}&lang=${preferredLanguage}`,{
                headers: {
                    'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
                }
            }).then(res => res.json().then(data => {
                if(data.error){
                    resolve(this.error(data.error.errorCode, data.error.errorMessage) as pageData);
                }
                resolve(data);
            })).catch(err => {
                resolve(this.error(2, err.message) as pageData);
            });
    })
    componentDidMount() {
        this.fetchData.then(data => this.setState({data}));
    }
    render() {
        if(this.state.data._id==="WAIT")
            return <Loader loading={true}/>;
        else {
            document.title=`${this.state.data.metadata?.title||this.state.data.url||this.state.data._id} | ${this.state.data.metadata?.websiteTitle||document.location.hostname}`
            if (this.state.data.metadata?.description)
                document.querySelector('meta[name="description"]')?.setAttribute("content", this.state.data.metadata.description);
            return (
                <div className="App" id="MainDiv" data-page={this.state.data._id}
                     data-user={JSON.stringify(this.state.data.userData)}>
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
