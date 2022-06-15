import Navbar, {NavbarProps} from "./navbar";
import Hero, {HeroProps} from './hero';
import Paragraph, {ParagraphProps} from "./paragraph";
import Modal, {ModalProps} from "./modal";
import Auth, {AuthProps} from "./auth";
export type ComponentProps=
    {
        hero: HeroProps,
        navbar: NavbarProps,
        paragraph: ParagraphProps,
        modal: ModalProps,
        auth: AuthProps
    }
export default function Component(component: ComponentProps[keyof ComponentProps]) {
    switch (component.type) {
        case "hero":
            return <Hero {...component} />;
        case "navbar":
            return <Navbar {...component} />;
        case "paragraph":
            return <Paragraph {...component} />;
        case "modal":
            return <Modal {...component} />;
        case "auth":
            return <Auth {...component} />;
    }
};