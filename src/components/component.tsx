import Navbar, {NavbarProps} from "./navbar";
import Hero, {HeroProps} from './hero';
import Paragraph, {ParagraphProps} from "./paragraph";
import Modal, {ModalProps} from "./modal";
import React from "react";
export type ComponentSpec = {
    name: string;
    icon: string;
    component: React.ComponentType<any>;
    properties: Array<{
        category: string;
        settings: Array<{
            name: string;
            systemName: string;
            type: "string" | "number" | "boolean" | "localizedString" | "localizedRichText";
        }>
    }>
}
export const UserAddableComponents: Array<ComponentSpec> = [
    {
        name: "hero",
        icon: "PhotographIcon",
        component: Hero,
        properties: [
            {
                category: "General",
                settings: [
                    {
                        name: "Title",
                        systemName: "title",
                        type: "localizedString",
                    },
                    {
                        name: "Subtitle",
                        systemName: "subtitle",
                        type: "localizedString",
                    }
                ]
            },
            {
                category: "Appearance",
                settings: [
                    {
                        name: "Image",
                        systemName: "image",
                        type: "string",
                    }
                ]
            }
        ]
    },
    {
        name: "paragraph",
        icon: "DocumentTextIcon",
        component: Paragraph,
        properties: [
            {
                category: "General",
                settings: [
                    {
                        name: "Content",
                        systemName: "content",
                        type: "localizedRichText",
                    }
                ]
            }
        ]
    }
]
export type ComponentProps=
    {
        hero: HeroProps,
        navbar: NavbarProps,
        paragraph: ParagraphProps,
        modal: ModalProps,
    }
export default function Component(component: ComponentProps[keyof ComponentProps]){
    switch (component.type) {
        case "hero":
            return <Hero {...component}/>;
        case "navbar":
            return <Navbar {...component} />;
        case "paragraph":
            return <Paragraph {...component}/>;
        case "modal":
            return <Modal {...component} />;
    }
};