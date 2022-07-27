import {localizedString} from "../util/localizedString";

function localise(arr:localizedString, n:string){
    if(!arr)
        return "";
    const preferredLanguage = n.toUpperCase();
    if(arr.hasOwnProperty(preferredLanguage)){
        return arr[preferredLanguage];
    }
    return arr["default"];
}
export default localise;