import {localizedString} from "../util/localizedString";
import {Db} from "mongodb";

export class WebsiteConfig {
    metadata: {
        title: localizedString,
        logo: string,
        smallLogo: string,
    }
    pwa: {
        name: string,
        shortName: string,
        displayMode: string,
        icons: Array<{src: string, sizes: string, type: string}>
    }
    visible: boolean
    constructor(metadata: { title: localizedString, logo: string, smallLogo: string }, pwa: { name: string, shortName: string, displayMode: string, icons: Array<{src: string, sizes: string, type: string}>}, visible: boolean) {
        this.metadata = metadata;
        this.pwa = pwa;
        this.visible = visible;
    }
    static async getCurrentConfig(db: Db): Promise<WebsiteConfig> {
        const config = await db.collection("pages").findOne({url:"*"});
        if(config)
            return new WebsiteConfig(config.metadata, config.pwa, config.visible);
        else
            return new WebsiteConfig({title: {}, logo: "", smallLogo: ""}, {name: "", shortName: "", displayMode: "standalone", icons:[]}, true);
    }
    async save(db: Db): Promise<void> {
        await db.collection("pages").updateOne({url:"*"}, {$set: {metadata: this.metadata, pwa: this.pwa, visible: this.visible}}, {upsert: true});
    }
    renderManifest(): string {
        return `{
          "name": "${this.pwa.name}",
          "short_name": "${this.pwa.shortName}",
          "start_url": "/",
          "display": "${this.pwa.displayMode}",
          "icons": [
                ${this.pwa.icons.map(icon => `{
                    "src": "${icon.src}",
                    "sizes": "${icon.sizes}",
                    "type": "${icon.type}"
                }`).join(",")}
          ]
        }`;
    }
}