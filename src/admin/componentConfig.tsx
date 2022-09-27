import React from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import {ComponentSpec} from "../components/component";
import Property from "../util/property";
import {localizedString} from "../util/localizedString";
import Hero, {HeroProps} from "../components/hero";
import Paragraph, {ParagraphProps} from "../components/paragraph";

type ComponentConfigProps = {
    visible: boolean,
    onClose?: () => void,
    componentSpec?: ComponentSpec,
    componentData?: {[key: string]: string|number|boolean|localizedString},
    pageId: string,
    componentId?: string
}

type ComponentConfigState = {
    componentData?: {[key: string]: string|number|boolean|localizedString}
}

class ComponentConfig extends React.Component<ComponentConfigProps,ComponentConfigState> {
    constructor(props: ComponentConfigProps) {
        super(props);
        this.state={
            componentData: props.componentData||{},
        }
    }
    componentDidUpdate(prevProps: Readonly<ComponentConfigProps>) {
        if (prevProps.componentData !== this.props.componentData) {
            this.setState({componentData: this.props.componentData});
        }
    }

    renderComponentPreview(type: string, data?: {[key: string]: string|number|boolean|localizedString}) {
        switch (type) {
            case "hero":
                return <Hero id="preview" type="hero" data={data as HeroProps["data"]} />;
            case "paragraph":
                return <Paragraph id="preview" type="paragraph" data={data as ParagraphProps["data"]}/>;
            default:
                return null;
        }
    };
    saveComponent(){
        console.log("pageId", this.props.pageId);
        let componentData = this.state.componentData;
        if (componentData) {
            delete componentData["preferredLanguage"];
        }
        const payload = {
            //TODO: allow adding components at specific position
            position: new Date().getTime().toString(),
            type: this.props.componentSpec?.name,
            data: componentData
        }
        console.log(payload);
        fetch(`/api/components?pageId=${this.props.pageId}&componentId=${this.props.componentId}`,{
            method: this.props.componentId? "POST" : "PUT",
            headers: {
                'session': localStorage.getItem('session')||sessionStorage.getItem('session')||''
            },
            body: JSON.stringify(payload)
        }).then((response)=>{
            if(response.ok){
                window.location.search = "forceReload=true";
            }
        }).catch((reason)=>{
            console.error(reason)
        })
    }
    render() {
        const {componentSpec, visible, onClose} = this.props;
        return (
            <div className={visible?"w-full fixed h-full overflow-auto z-30 top-0 left-0 bottom-0 right-0 backdrop-blur-3xl":"hidden"}>
                <div className="m-0 md:rounded-xl h-screen p-2">
                    <main className="mx-auto">
                        <div className="relative z-10 flex items-baseline justify-between pt-10 pb-6 border-b border-gray-200">
                            <h1 className="text-4xl capitalize tracking-tight text-gray-900 dark:text-gray-300">{componentSpec?.name} configuration</h1>
                            <div className="flex items-center"></div>
                        </div>
                        <section aria-labelledby="products-heading" className="pt-6 pb-6">
                            <h2 id="products-heading" className="sr-only">
                                Component properties
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-1 gap-y-10">
                                <form className="block">
                                    {componentSpec?.properties.map((category) => (
                                        <Disclosure as="div" key={category.category} className="px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root">
                                                        <Disclosure.Button className="px-2 py-3 bg-white dark:bg-gray-800 w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                                                            <span className="font-medium text-gray-900 dark:text-gray-100">{category.category}</span>
                                                            <span className="ml-6 flex items-center">
                                  {open ? (
                                      <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                      <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {category.settings.map((property) => (
                                                                <div key={property.name} className="flex items-center justify-between">
                                                                    <label className="w-full items-center">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{property.name}</p>
                                                                        <Property type={property.type} value={this.state.componentData?this.state.componentData[property.systemName]:{}} onChange={(value) => this.setState({componentData: {...this.state.componentData,[property.systemName]: value}})} />
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                                <div className="col-span-2">
                                    <p className="text-[#444] dark:text-[#eee]">Preview</p>
                                    <div className="border-4 border-dashed border-current rounded-lg h-96 lg:h-full overflow-auto" >
                                        {this.renderComponentPreview(componentSpec?.name||"", this.state.componentData)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12">
                                <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                                    Cancel
                                </button>
                                <button onClick={()=>this.saveComponent()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full float-right">
                                    Save
                                </button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        )
    }
}

export default ComponentConfig