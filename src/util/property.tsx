import LocalizedStringEditor, {localizedString} from "./localizedString";

type PropertyTypes = "string" | "number" | "boolean" | "localizedString" | "localizedRichText";

export type PropertyProps<PropertyType extends PropertyTypes> = {
    type: PropertyType;
    value?: any;
    onChange?: (value: any) => void;
}
export default function Property(property: PropertyProps<PropertyTypes>) {
    switch (property.type) {
        case "string":
            return <input type="text" className="form-input w-full dark:bg-gray-800 dark:text-gray-100" defaultValue={property.value as string}
                          onChange={(e) => property.onChange && property.onChange(e.target.value)}/>;
        case "number":
            return <input type="number" className="form-input w-full dark:bg-gray-800 dark:text-gray-100" value={property.value as number} required min="18" max="99"
                          onChange={(e) => property.onChange && property.onChange(parseInt(e.target.value))}/>
        case "boolean":
            return <input type="checkbox" checked={property.value as boolean}
                          onChange={(e) => property.onChange && property.onChange(e.target.checked)}/>
        case "localizedString":
            return <LocalizedStringEditor value={property.value as localizedString}
                                          onChange={(value) => property.onChange && property.onChange(value)}/>
        case "localizedRichText":
            return <LocalizedStringEditor value={property.value as localizedString} richText={true}
                                          onChange={(value) => property.onChange && property.onChange(value)}/>
        default:
            /*ignore property with unknown type and just
            add next element in the row*/
            return <>{}</>
    }
}