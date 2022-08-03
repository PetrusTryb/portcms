import React from "react";
import {localize, localizedString} from "../util/localizedString";
import ComponentActions from "../admin/componentActions";

export type HeroProps = {
    id: string,
    type: "hero",
    data: {
        title: string|localizedString,
        subtitle: string|localizedString,
        image: string,
        preferredLanguage?: string,
    },
    userData?: {
        "_id": string,
        "username": string,
        "roles": string[]
    }
}

class Hero extends React.Component<HeroProps, {}> {
    render() {
        let { title, subtitle, image } = this.props.data;
        if(!this.props.data.preferredLanguage)
            this.props.data.preferredLanguage = navigator.language.split('-')[0].toUpperCase()
        if(typeof title !== "string" && title){
            title = localize(title, this.props.data.preferredLanguage)
        }
        if(typeof subtitle !== "string" && subtitle){
            subtitle = localize(subtitle, this.props.data.preferredLanguage)
        }
        return (
            <div className="relative bg-white dark:bg-gray-800 overflow-hidden">
                <ComponentActions componentId={this.props.id} userData={this.props.userData}/>
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative z-10 pb-8 bg-white dark:bg-gray-800 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <svg
                            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white dark:text-gray-800 transform translate-x-1/2"
                            fill="currentColor"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <polygon points="50,0 100,0 50,100 0,100"/>
                        </svg>
                        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="sm:text-center lg:text-left py-10">
                                <h1 className="text-4xl tracking-tight font-bold text-gray-900 dark:text-gray-200 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">{title}</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 italic">
                                    {subtitle}
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">

                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                        className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                        src={image}
                        alt=""
                    />
                </div>
            </div>
        )
    }
}

export default Hero;