import {Handler} from '@netlify/functions'
import {Db} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";
import localise from "./localisationHelper";
import {WebsiteConfig} from "../classes/config";
import {Page} from "../classes/page";

const handler: Handler = async (event) => {
    let db:Db;
    try {
        db = await connectToDatabase();
    }catch{
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    errorCode: 50001,
                    errorMessage: "Database connection error."
                }
            })
        }
    }
    // Installation check - database exists
    if (!(await db.listCollections().toArray()).find(c => c.name === "users")) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    errorCode: 50002,
                    errorMessage: "PortCMS is not yet installed."
                }
            })
        }
    }
    const pageUrl = event.queryStringParameters?.url;
    const preferredLanguage = event.queryStringParameters?.lang;
    const id = event.queryStringParameters?.id;
    const user = await checkSession(db, event.headers["session"]);
    if (event.httpMethod === 'GET') {
        const globalConfig = await WebsiteConfig.getCurrentConfig(db);
        if (id) {
            if (!user?.roles.includes("admin")) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40301,
                            errorMessage: "You have insufficient permissions."
                        }
                    })
                }
            }
            let page = await Page.getById(id, db);
            if (!page) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40402,
                            errorMessage: "Could not find page with id " + id
                        }
                    })
                }
            }
            delete page.database;
            delete page.userData;
            return {
                statusCode: 200,
                body: JSON.stringify(page)
            }
        }
        else if(pageUrl==="*"){
            if (!user?.roles.includes("admin")) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40301,
                            errorMessage: "You have insufficient permissions."
                        }
                    })
                }
            }
            else {
                const pages = await Page.getAll(db);
                let globalConfig = await WebsiteConfig.getCurrentConfig(db);
                let result = pages;
                let translatedResult = null;
                if(preferredLanguage){
                    translatedResult = pages.map(p=>{
                        return p.toTranslatedObject(preferredLanguage, localise(globalConfig.metadata.title, preferredLanguage));
                    }); console.log(translatedResult);
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify(translatedResult || result),
                    headers: {
                        "x-maintenance-mode": globalConfig.visible ? "false" : "true",
                        "x-user-name": user.username,
                        "x-last-login": user.sessions[user.sessions.length-1].created.toISOString(),
                    }
                }
            }
        }else {
            const page = await Page.getByUrl(pageUrl||"/", db);
            let allPages = await Page.getAll(db);
            if (!page) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40401,
                            errorMessage: "Page not found."
                        }
                    })
                }
            }
            if(!globalConfig?.visible && !user?.roles.includes("admin")){
                return {
                    statusCode: 503,
                    body: JSON.stringify({
                        error: {
                            errorCode: 50301,
                            errorMessage: "This website is currently under maintenance. Please try again later."
                        }
                    })
                    ,headers:{"x-user-name":user?.username||"","x-last-login":user?.sessions[user.sessions.length-1].created.toISOString()||"","x-maintenance-mode":true}}
            }
            if(page.visible || user?.roles.includes("admin")){
                let result = page;
                page.sortComponents();
                page.addNavComponent(allPages, preferredLanguage||"default", user, globalConfig?.metadata.logo, globalConfig?.metadata.smallLogo);
                result.userData = user;
                let translatedResult = null;
                if(preferredLanguage){
                    translatedResult = page.toTranslatedObject(preferredLanguage, localise(globalConfig.metadata.title, preferredLanguage));
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify(translatedResult || result)
                }
            }
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions."
                    }
                })
            }
        }
    }
    if (event.httpMethod === 'PUT') {
        if (!user?.roles.includes("admin")) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions."
                    }
                })
            }
        }
        if(!event.body){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "No page data provided."
                    }
                })
            }
        }
        const page = JSON.parse(event.body);
        if(!page.url||!page.title){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40002,
                        errorMessage: "No page url or title provided."
                    }
                })
            }
        }
        const pages = await Page.getByUrl(page.url, db);
        if(pages){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40003,
                        errorMessage: "Page with this url already exists."
                    }
                })
            }
        }
        let pageData = new Page(page.url, {title: page.title, description:page.description}, page.visible);
        await pageData.save(db, user._id);
        return {
            statusCode: 200
        }
    }
    if (event.httpMethod === 'POST'){
        if (!user?.roles.includes("admin")) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions."
                    }
                })
            }
        }
        const page = JSON.parse(event.body||"{}");
        if(!page.id){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40002,
                        errorMessage: "No page id provided."
                    }
                    , hint: page.id1?"PATCH /api/pages/":"PUT /api/pages/"})
            }
        }
        const oldPage = await Page.getById(page.id, db);
        if(!oldPage){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40402,
                        errorMessage: "Could not find page with id " + page.id
                    }
                })
            }
        }
        if(page.url){
            const pages = await Page.getByUrl(page.url, db);
            if(pages && pages._id.toString()!==page.id){
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40003,
                            errorMessage: "Page with this url already exists."
                        }
                    })
                }
            }
            oldPage.url = page.url;
        }
        if(page.title){
            oldPage.metadata.title = page.title;
        }
        if(page.description){
            oldPage.metadata.description = page.description;
        }
        if(page.visible!==undefined){
            oldPage.visible = page.visible;
        }
        await oldPage.save(db, user._id);
        return {
            statusCode: 200
        }
    }
    if (event.httpMethod === 'PATCH'){
        if (!user?.roles.includes("admin")) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions."
                    }
                })
            }
        }
        const data = JSON.parse(event.body||"{}");
        if(data.id){
            let instance = await Page.getById(data.id, db);
            if(!instance){
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40402,
                            errorMessage: "Could not find page with id " + data.id
                        }
                    })
                }
            }
            instance.visible = data.visible;
            await instance.save(db, user._id);
            return {
                statusCode: 200,
                body: "{}"
            }
        }
        else if(!data.id1||!data.id2){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    hint:data.id?"POST /api/pages/":"", error: {
                        errorCode: 40002,
                        errorMessage: "No page id provided."
                    }
                })
            }
        }
        const leftPage = await Page.getById(data.id1, db);
        const rightPage = await Page.getById(data.id2, db);
        if (!leftPage || !rightPage) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40003,
                        errorMessage: "Cannot swap pages positions - one of the pages does not exist."
                    }
                })
            }
        }
        const leftPosition = leftPage.position;
        leftPage.position = rightPage.position;
        rightPage.position = leftPosition;
        await leftPage.save(db, user._id);
        await rightPage.save(db, user._id);
        return {
            statusCode: 200,
            body: "{}"
        }
    }
    if (event.httpMethod === 'DELETE'){
        if (!user?.roles.includes("admin")) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions."
                    }
                })
            }
        }
        const pageId = JSON.parse(event.body||"{}").id;
        if(!pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40002,
                        errorMessage: "No page id provided."
                    }
                })
            }
        }
        const instance = await Page.getById(pageId, db);
        if(!instance){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40402,
                        errorMessage: "Could not find page with id " + pageId
                    }
                })
            }
        }
        await instance.delete();
        return {
            statusCode: 200
        }
    }
    return {
        statusCode: 400
    }
}

export { handler }