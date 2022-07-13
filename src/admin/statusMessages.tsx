import {CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon} from "@heroicons/react/solid";

export type StatusMessagesProps = {
    messages?: StatusMessage[],
}
export type StatusMessage = {
    type: "success" | "warning",
    message: string,
    link?: string,
}
export function StatusMessages(props: StatusMessagesProps){
    return <section>
        <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-t-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-400">
                        <InformationCircleIcon className="mr-2 w-5 h-5 inline"/>
                        Website status
                    </h3>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-b-lg">
                {(props.messages||[]).map((status, index) => {
                    return <a key={index} href={status.link}>
                        <div className="px-4 py-5 border-b border-gray-200 dark:border-y-gray-900 sm:px-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {status.type === "success" ?
                                        <CheckCircleIcon className="w-5 h-5 inline text-green-600"/> :
                                        <ExclamationCircleIcon className="w-5 h-5 inline text-orange-600"/>}
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