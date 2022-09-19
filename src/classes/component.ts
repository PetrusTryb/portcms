import {Db, ObjectId} from "mongodb";
import {Page} from "./page";

export class Component {
    id: ObjectId;
    type: string;
    data: any;
    position: number;
    constructor(type: string, data: any, id?: ObjectId, position?: number) {
        this.id = id || new ObjectId();
        this.type = type;
        this.data = data;
        this.position = position || new Date().getTime();
    }
    static async getById(pageId: string, componentId: string, db: Db) {
        const page = await Page.getById(pageId, db);
        if (!page)
            return null;
        const component = page.components.find(c => c.id.equals(new ObjectId(componentId)));
        if (!component)
            return null;
        return new Component(component.type, component.data, component.id, component.position);
    }
    async move(db: Db, pageId: string, userId: string, move: number) {
        let page = await Page.getById(pageId, db);
        if (!page)
            return null;
        page.sortComponents();
        const components = page.components;
        if (!this)
            return null;
        const componentIndex = components.findIndex(c => c.id.equals(this.id));
        if (move === 0) {
            return null;
        }
        if (move === -1 && componentIndex === 0) {
            return null;
        }
        if (move === 1 && componentIndex === components.length - 1) {
            return null;
        }
        const nextComponent = await Component.getById(pageId, components[componentIndex + move].id.toString(), db);
        if (!nextComponent)
            return null;
        const nextComponentPosition = nextComponent.position;
        nextComponent.position = this.position;
        this.position = nextComponentPosition;
        await nextComponent.save(db, pageId, userId);
        await this.save(db, pageId, userId);
    }
    async save(db: Db, pageId: string, userId: string) {
        const page = await Page.getById(pageId, db);
        if (!page)
            return null;
        const component = page.components.find(c => c.id.equals(this.id));
        if (component) {
            component.data = this.data;
            component.position = this.position;
        }
        else {
            page.components.push({id: this.id, type: this.type, data: this.data, position: this.position});
        }
        await page.save(db,new ObjectId(userId));
    }
    async delete(db: Db, pageId: string, userId: string) {
        const page = await Page.getById(pageId, db);
        if (!page)
            return null;
        page.components = page.components.filter(c => !c.id.equals(this.id));
        await page.save(db,new ObjectId(userId));
    }
}