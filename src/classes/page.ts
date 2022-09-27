import {Db, ObjectId} from "mongodb";
import {localizedString} from "../util/localizedString";
import localise from "../lambda/localisationHelper";

export class Page{
    _id: ObjectId;
    url: string;
    metadata: {
        title: localizedString;
        description: localizedString;
        updatedAt?: Date;
        updatedBy?: ObjectId;
    };
    components: Array<{
        type: string;
        data: any;
        userData?: any;
        position: number;
        id: ObjectId;
    }>;
    visible: boolean;
    position: number;
    userData?: any;
    database?: Db;
    constructor(url: string, metadata: {title: localizedString, description: localizedString, updatedAt?: Date, updatedBy?: ObjectId}, visible: boolean, position?: number, components?: Array<{type: string, data: any, userData?: any, position: number, id: ObjectId}>, id?: ObjectId, db?:Db){
        this._id = id || new ObjectId();
        this.url = url;
        this.metadata = metadata;
        this.components = components || [];
        this.visible = visible;
        this.position = position||new Date().getTime();
        this.database = db;
    }
    static async getById(id: string, db: Db){
        const page = await db.collection("pages").findOne({_id: new ObjectId(id)});
        if(page){
            return new Page(page.url, page.metadata, page.visible, page.position, page.components, page._id, db);
        }
        return null;
    }
    static async getByUrl(url: string, db: Db){
        const page = await db.collection("pages").findOne({url: url});
        if(page){
            return new Page(page.url, page.metadata, page.visible, page.position, page.components, page._id, db);
        }
        return null;
    }
    static async getAll(db: Db){
        const pages = await db.collection("pages").find({
            url: {$ne: "*"}
        }).toArray();
        return pages.map(page => new Page(page.url, page.metadata, page.visible, page.position, page.components, page._id, db));
    }
    async save(db?: Db, user?: ObjectId){
        this.metadata.updatedAt = new Date();
        this.metadata.updatedBy = user;
        if(db)
            this.database = db;
        if(!this.database)
            throw "No database assigned to page";
        const toSave = {...this}
        delete toSave.userData
        delete toSave.database
        return await this.database.collection("pages").replaceOne({_id: this._id}, toSave, {upsert: true});
    }
    async delete(){
        if(!this.database)
            throw "No database assigned to page";
        return await this.database.collection("pages").deleteOne({_id: this._id});
    }
    toTranslatedObject(locale: string, websiteTitle: string){
        return {
            _id: this._id,
            url: this.url,
            metadata: {
                title: localise(this.metadata.title, locale),
                description: localise(this.metadata.description, locale),
                websiteTitle: websiteTitle,
                updatedAt: this.metadata.updatedAt,
                updatedBy: this.metadata.updatedBy
            },
            components: this.components,
            visible: this.visible,
            position: this.position,
            userData: this.userData
        }
    }
    getNavbarEntry(locale: string){
        return {
            id: this._id,
            url: this.url,
            name: localise(this.metadata.title, locale),
        }
    }
    addNavComponent(pagesList: Array<Page>, locale: string, userData?:any, logo?: string, smallLogo?: string){
        pagesList = pagesList.sort((a, b) => a.position - b.position);
        const navPages = pagesList.filter(page => page.visible);
        let nav = {
            "id": new ObjectId(),
            "type": "navbar",
            "data": {
                "pages": navPages.map(p=>{
                    return p.getNavbarEntry(locale);
                }),
                "user": userData,
                "logo": logo,
                "smallLogo": smallLogo
            },
            "position": 0
        }
        this.components = [nav, ...this.components];
    }
    sortComponents(){
        this.components = this.components.sort((a, b) => a.position - b.position);
    }
}