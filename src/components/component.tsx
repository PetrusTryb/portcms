import Navbar, {NavbarProps} from "./navbar";
import Hero, {HeroProps} from './hero';
export type ComponentProps={hero: HeroProps, navbar: NavbarProps}
export default function Component(component: ComponentProps[keyof ComponentProps]) {
    switch (component.type) {
        case "hero":
            return <Hero {...component} />;
        case "navbar":
            return <Navbar {...component} />;
    }
};