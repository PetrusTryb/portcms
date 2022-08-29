import {localizedString} from "../util/localizedString";
import React from "react";
import ComponentConfig from "./componentConfig";
import {ArrowDownIcon, ArrowUpIcon, CogIcon, TrashIcon} from "@heroicons/react/solid";
import {ComponentSpec, UserAddableComponents} from "../components/component";
import Modal from "../components/modal";

type ComponentActionsProps = {
    componentId: string,
    userData?: {
        "_id": string,
        "username": string,
        "roles": string[]
    }
}

type ComponentActionsState = {
    visible: boolean,
    pageId: string,
    componentData?: {[key: string]: string|number|boolean|localizedString},
    componentSpec?: ComponentSpec,
    isModalOpen?: boolean,
    userData?: {
        "_id": string,
        "username": string,
        "roles": string[]
    }
}

class ComponentActions extends React.Component<ComponentActionsProps,ComponentActionsState> {
    constructor(props: ComponentActionsProps) {
        super(props);
        this.state = {
            visible: false,
            pageId: document.getElementById("MainDiv")?.dataset.page||"",
            userData: this.props.userData,
        }
    }
    getPermissions():number {
        //In the future, this will return permissions level of the user
        const user = this.state.userData;
        if(!user||!user.roles)
            return -1
        return user.roles.indexOf("admin");
    }
    openComponentConfig() {
        const pageId = document.getElementById("MainDiv")?.dataset.page||"";
        this.setState({
            pageId: pageId,
        })
        fetch(`/api/components/?componentId=${this.props.componentId}&pageId=${pageId}`,{
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
            },
        }).then((response)=>{
            if(response.ok) {
                response.json().then((data)=>{
                    this.setState({
                        componentData: data.data,
                        componentSpec: UserAddableComponents.find((c)=>c.name===data.type),
                        visible: true,
                    })
                })
            }
        })
    }
    moveComponent(direction: -1|1) {
        const pageId = document.getElementById("MainDiv")?.dataset.page||"";
        const componentId = this.props.componentId;
        fetch(`/api/components/move?pageId=${pageId}&componentId=${componentId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                move: direction
            }),
            headers: {
                "session": localStorage.getItem('session') || sessionStorage.getItem('session') || '',
            }
        }).then(response => {
            if (response.ok) {
                window.location.reload();
            } else {
                console.log("error");
            }
        }).catch(error => {
                console.log(error);
            }
        )
    }
    render() {
        if(this.props.componentId === "preview")
            return null;
        return <>
            <Modal id="DEL" type="modal" data={{
                title: "Confirm delete",
                message: `Do You really want to delete this component? This cannot be undone.`,
                primaryAction: {
                    label: "Delete",
                    onClick: () => {
                        fetch(`/api/components/?pageId=${document.getElementById("MainDiv")?.dataset.page||""}&componentId=${this.props.componentId}`, {
                            method: 'DELETE',
                            headers: {
                                "session": localStorage.getItem('session') || sessionStorage.getItem('session') || '',
                            }
                        }).then(response => {
                            if (response.ok) {
                                window.location.reload();
                            } else {
                                console.log("error");
                            }
                        }).catch(error => {
                                console.log(error);
                            }
                        )
                    }
                },
                secondaryAction: {
                    label: "Cancel",
                    onClick: () => {
                        this.setState({
                            isModalOpen: false,
                        })
                    }
                }
            }} hidden={!this.state.isModalOpen}></Modal>
            <ComponentConfig onClose={()=>this.setState({visible:false})} visible={this.state.visible} pageId={this.state.pageId} componentId={this.props.componentId} componentSpec={this.state.componentSpec} componentData={this.state.componentData}/>
            <div className={this.getPermissions()>-1?"absolute right-1 z-20 mr-4 bg-gray-500 rounded-2xl opacity-70":"hidden"}>
            <button className="font-bold py-1 px-1 rounded-full" title={`Edit component`} onClick={()=>this.openComponentConfig()}>
                <CogIcon className="w-4 h-4 inline text-[#cccccc] hover:text-current"/>
            </button>
            <button className="font-bold py-1 px-1 rounded-full" title={`Remove component`} onClick={()=>this.setState({isModalOpen:true})}>
                <TrashIcon className="w-4 h-4 inline text-red-900 hover:text-black"/>
            </button>
            <button className="font-bold py-1 px-1 rounded-full" title={`Move component up`} onClick={()=>this.moveComponent(-1)}>
                <ArrowUpIcon className="w-4 h-4 inline text-[#fffacd] hover:text-current"/>
            </button>
            <button className="font-bold py-1 px-1 rounded-full" title={`Move component down`} onClick={()=>this.moveComponent(1)}>
                <ArrowDownIcon className="w-4 h-4 inline text-[#fffacd] hover:text-current"/>
            </button>
        </div></>
    }
}
export default ComponentActions;