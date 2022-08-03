import {CodeIcon, ShieldExclamationIcon, XIcon} from "@heroicons/react/solid";
import {ComponentSpec, UserAddableComponents} from "../components/component";
import React from "react";
import * as icons from "@heroicons/react/solid";

export type addComponentProps = {
    visible: boolean;
    pageVisible?: boolean;
    onClose: (result?: ComponentSpec) => void;
}

class AddComponent extends React.Component<addComponentProps, {visible:boolean}>{
    constructor(props: addComponentProps){
        super(props);
        this.state = {visible: props.visible};
    }
    componentDidUpdate(prevProps: Readonly<addComponentProps>) {
        if (this.props.visible !== prevProps.visible) {
            this.setState({visible: this.props.visible});
        }
    }

    HeroIcon = (props: {icon: keyof typeof icons}): JSX.Element => {
        let Icon: (props: React.ComponentProps<"svg">) => JSX.Element = icons[props.icon];
        return (
            <Icon className="h-5 w-5 inline" />
        );
    };
    render() {
        if (!this.props.visible)
            return null;
        return <div className={!this.state.visible ? "hidden" : ""}>
            <div tabIndex={-1}
                 className="overflow-y-auto overflow-x-hidden fixed backdrop-blur-sm top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
                 aria-modal="true" role="dialog">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                        <button type="button"
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                                onClick={() => this.props.onClose()}>
                            <XIcon className="w-5 h-5"/>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                            <h3 className="text-base font-bold text-gray-900 lg:text-xl dark:text-white">
                                Add component
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Select a component to add to this page.
                            </p>
                            {this.props.pageVisible &&
                                <p className="text-sm font-light text-[#fffd00] mt-2">
                                    <ShieldExclamationIcon className="h-5 w-5 inline"/> Notice:<br/>This page is now
                                    visible to everyone. This means that any component added to this page will be
                                    visible to everyone. It is recommended to hide this page while you are working on it.
                                </p>
                            }
                            <ul className="my-4 space-y-3">
                                {UserAddableComponents.sort((a, b) => a.name.localeCompare(b.name)).map(component => {
                                    return <li key={component.name}>
                                        <button onClick={() => this.props.onClose(component)}
                                                className="flex items-center w-full p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                            <span className="flex-1 whitespace-nowrap capitalize"><><this.HeroIcon
                                                icon={component.icon as keyof typeof icons}></this.HeroIcon>
                                                {component.name}</></span>
                                        </button>
                                    </li>
                                })}
                            </ul>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b">
                            <a href="https://github.com/PetrusTryb/portcms/issues" className="text-[#0d73cc]" target="_blank" rel="noreferrer"><CodeIcon className="w-5 h-5 text-[#1a8fff] inline"/> Suggest another component</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
export default AddComponent;