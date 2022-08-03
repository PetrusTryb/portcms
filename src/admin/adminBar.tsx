import {ViewGridAddIcon, PencilAltIcon, EyeIcon, EyeOffIcon} from "@heroicons/react/solid";
import AddComponent from "./addComponent";
import React from "react";
import {ComponentSpec} from "../components/component";
import ComponentConfig from "./componentConfig";
import {localizedString} from "../util/localizedString";

export type AdminBarProps = {
    pageData?: {
        _id: string,
        url?: string,
        metadata?: {
            title: string,
            description?: string,
        },
        visible?: boolean,
    },
}
export type AdminBarState = {
    addComponentVisible: boolean,
    componentConfigVisible: boolean,
    componentSpec?: ComponentSpec,
    componentProps?: {[key: string]: string|number|boolean|localizedString},
}

class AdminBar extends React.Component<AdminBarProps, AdminBarState> {
    constructor(props: AdminBarProps) {
        super(props);
        this.state = {
            addComponentVisible: false,
            componentConfigVisible: false,
        }
    }
    toggleVisibility = () => {
        if(this.props.pageData)
            fetch('/api/pages', {
                method: 'PATCH',
                headers: {
                    'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
                },
                body: JSON.stringify({
                    id: this.props.pageData._id,
                    visible: !this.props.pageData.visible,
                })
            }).then(res => res.json().then(response => {
                if(!response.error) {
                    document.location.reload();
                }
                else {
                    console.error(response.error);
                }
            }))
    }
    openComponentConfig = (componentSpec?: ComponentSpec, componentProps?: {[key: string]: string|number|boolean|localizedString}) => {
        if(componentSpec)
            this.setState({
                addComponentVisible: false,
                componentConfigVisible: true,
                componentSpec,
                componentProps,
            })
        else
            this.setState({
                addComponentVisible: false,
            })
    }
    render() {
        const {pageData} = this.props;
        const {addComponentVisible, componentConfigVisible, componentSpec, componentProps} = this.state;
        return <div>
            <ComponentConfig pageId={pageData?._id||""} visible={componentConfigVisible} componentSpec={componentSpec} componentData={componentProps} onClose={()=>this.setState({componentConfigVisible:false})}/>
            <AddComponent visible={addComponentVisible} onClose={(result) => this.openComponentConfig(result)} pageVisible={pageData?.visible}/>
            <div className="bg-gray-800 w-full">
                <aside
                    className="fixed bottom-0 left-0 z-20 p-1 w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span className="text-sm text-black sm:text-center dark:text-white">
        Current Page: <code>{pageData?.url}</code> ({pageData?.metadata?.title})
    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li>
                            <button onClick={()=>{this.setState({addComponentVisible:true})}} title="Add component" className="p-2 mr-0.5 border border-gray-200 dark:border-gray-600 rounded-full dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-700">
                                <ViewGridAddIcon className="w-5 h-5 inline"/> Add component
                            </button>
                        </li>
                        <li>
                            <button title="Page properties" onClick={()=>document.location.href='/cms/admin/pages/'+pageData?._id} className="p-2 mr-0.5 border border-gray-200 dark:border-gray-600 rounded-full dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-700">
                                <PencilAltIcon className="w-5 h-5 inline"/> Properties
                            </button>
                        </li>
                        <li>
                            <button title={pageData?.visible?"Hide this page":"Publish this page"} onClick={this.toggleVisibility} className="p-2 border border-gray-200 dark:border-gray-600 rounded-full dark:bg-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-700">
                                {pageData?.visible ? <EyeOffIcon className="w-5 h-5 inline text-[#cecb00]"/> : <EyeIcon className="w-5 h-5 inline"/>} {pageData?.visible?"Hide":"Publish"}
                            </button>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    }
}
export default AdminBar;