import emojiFlags from "emoji-flags";
import {useEffect, useState} from "react";

export type localizedString = {
    [key: string]: string
}
export type localizedStringEditorProps = {
    value: localizedString,
    onChange: (value: localizedString) => void,
}
export type localizedStringEditorState = {
    selectedLanguage: string,
    value: localizedString,
}
export default function LocalizedStringEditor(props: localizedStringEditorProps) {
    const [state, setState] = useState<localizedStringEditorState>({
        selectedLanguage: "default",
        value: props.value,
    });
    useEffect(() => {
        setState({
            selectedLanguage: "default",
            value: props.value,
        });
    }, [props.value]);
    const languages = emojiFlags.data;
    let languageOptions = [<option key='default' value='default'>(default)</option>]
    languages.forEach(language => {
        languageOptions.push(<option key={language.code} value={language.code}><>{language.emoji}</></option>);
    }
    );
    const languageSelect = <select value={state.selectedLanguage} onChange={e => {setState({ selectedLanguage: e.target.value, value: state.value});}} className="form-input inline w-3/12 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
        {languageOptions}
    </select>;
    const languageInput = <input type="text" className="form-input inline w-9/12 transition duration-150 ease-in-out sm:text-sm sm:leading-5" value={state.value[state.selectedLanguage]||""} onChange={e => {
        const newValue = { ...state.value };
        newValue[state.selectedLanguage] = e.target.value;
        setState({ selectedLanguage: state.selectedLanguage, value: newValue });
        props.onChange(newValue);
    }
    } />;
    return <div>
        {languageSelect}
        {languageInput}
    </div>;
}