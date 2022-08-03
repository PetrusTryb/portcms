import {ChartBarIcon, ExclamationCircleIcon, CheckCircleIcon} from "@heroicons/react/solid";
import React from "react";

export type StatusMessagesProps = {
    messages?: Array<StatusMessage>,
}
export type StatusMessage = {
    type: "success" | "warning",
    message: string,
    link?: string,
}

class StatusMessages extends React.Component<StatusMessagesProps> {
    render() {
        const {messages} = this.props;
        if (!messages) {
            return null;
        }
        return <section>
            <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 sm:rounded-t-lg shadow-current shadow-sm">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6 w-full h-[90px]">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                            <ChartBarIcon className="mr-2 w-5 h-5 inline text-accent"/>
                            Website status
                        </h3>
                        <p className="mt-0.5 text-sm text-black dark:text-gray-400">
                            If You see any issues, please report them <a rel="noreferrer" className="text-accent dark:text-[#FFE4C4]" target="_blank" href="https://github.com/PetrusTryb/portcms/issues">here</a>.
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-b-lg border-collapse pb-1">
                    {(messages).map((status, index) => {
                        return <a key={index} href={status.link}>
                            <div className="px-4 py-5 border-b border-white dark:border-y-dark sm:px-6 mx-auto">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {status.type === "success" ?
                                            <CheckCircleIcon className="w-5 h-5 inline text-[#faebd7]"/> :
                                            <ExclamationCircleIcon className="w-5 h-5 inline text-[#ff5a00]"/>}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-400">{status.message}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    })}
                </div>
            </div>
        </section>
    }
}

export default StatusMessages;