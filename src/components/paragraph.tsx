import {localize, localizedString} from "../util/localizedString";
import React from "react";
import ComponentActions from "../admin/componentActions";

export type ParagraphProps = {
    id: string,
    type: "paragraph",
    data: {
        content: string|localizedString,
        preferredLanguage?: string,
    },
    userData?: {
        "_id": string,
        "username": string,
        "roles": string[]
    }
}

class Paragraph extends React.Component<ParagraphProps, {}> {
    render() {
        let {content} = this.props.data;
        let {userData} = this.props;
        if(!this.props.data.preferredLanguage)
            this.props.data.preferredLanguage = navigator.language.split('-')[0].toUpperCase()
        if(typeof content !== "string" && content){
            content = localize(content, this.props.data.preferredLanguage);
        }
        return <div id={this.props.id} className="mx-4 my-4 text-black dark:text-white">
            <ComponentActions componentId={this.props.id} userData={userData}/>
            {content}
        </div>
    }
}

export default Paragraph;