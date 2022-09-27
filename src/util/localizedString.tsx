import {languageNameMap} from 'language-name-map'
import React from "react";
import ReactQuill from 'react-quill';

export type localizedString = {
    [key: string]: string
}
export type localizedStringEditorProps = {
    value: localizedString,
    onChange: (value: localizedString) => void,
    richText?: boolean
}
export type localizedStringEditorState = {
    selectedLanguage: string,
    value: localizedString,
}
export function localize(value: localizedString, language: string) {
    let res = "No text provided";
    if(value[language])
        res = value[language]
    else if(value["default"])
        res = value["default"]
    return res
}

class LocalizedStringEditor extends React.Component<localizedStringEditorProps, localizedStringEditorState> {
    constructor(props: localizedStringEditorProps) {
        super(props);
        this.state = {
            selectedLanguage: "default",
            value: props.value || {},
        }
    }
    componentDidUpdate(prevProps: Readonly<localizedStringEditorProps>) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                value: this.props.value,
            })
        }
    }
    textInput(rich:boolean){
        if(!rich)
            return <input type="text"
                          className="form-input w-full inline transition duration-150 ease-in-out sm:text-sm sm:leading-5 dark:bg-gray-800 dark:text-gray-100"
                          value={this.state.value[this.state.selectedLanguage] || ""} onChange={e => {
                const newValue = {...this.state.value};
                newValue[this.state.selectedLanguage] = e.target.value;
                this.setState({selectedLanguage: this.state.selectedLanguage, value: newValue});
                this.props.onChange(newValue);
            }
            }/>
        else
            return <ReactQuill className="form-input dark:bg-gray-800 dark:text-gray-100" theme="bubble" value={this.state.value[this.state.selectedLanguage] || ""} onChange={e => {
                const newValue = {...this.state.value};
                newValue[this.state.selectedLanguage] = e;
                this.setState({selectedLanguage: this.state.selectedLanguage, value: newValue});
                this.props.onChange(newValue);
            }}
            modules={{
                toolbar:[['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'color': [] }, { 'background': [] }, {'align': []}],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    ['link', 'video'],
                    ['clean']]
            }}
            />
   }

    render() {
        const languages = languageNameMap;
        let languageOptions = [<option key='default' value='default'>(default)</option>]
        for (let language in languages) {
            languageOptions.push(<option key={language} value={language.toUpperCase()}><>{languages[language].native}</>
            </option>);
        }
        const languageSelect = <select tabIndex={-1} value={this.state.selectedLanguage} onChange={e => {
            this.setState({selectedLanguage: e.target.value, value: this.state.value});
        }} className="form-input w-full sm:text-sm sm:leading-5 dark:bg-gray-800 dark:text-gray-100">
            {languageOptions}
        </select>;
        const languageInput = this.textInput(this.props.richText||false);
        return <div onClick={event => {event.preventDefault()}}>
            {languageSelect}
            {languageInput}
        </div>;
    }
}

export default LocalizedStringEditor;