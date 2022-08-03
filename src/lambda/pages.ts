import { Handler } from '@netlify/functions'
import {MongoClient, ObjectId} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";
import localise from "./localisationHelper";

const handler: Handler = async (event) => {
    let mongoClient:MongoClient;
    try {
        mongoClient = await connectToDatabase();
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
    const db = mongoClient.db("portCMS");
    // Installation check - database exists
    if (!(await db.listCollections().toArray()).find(c => c.name === "users")) {
        await mongoClient.close();
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
    const user = await checkSession(mongoClient, event.headers["session"]);
    if (event.httpMethod === 'GET') {
        if (id) {
            if (!user?.roles.includes("admin")) {
                await mongoClient.close();
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
            const page = await db.collection("pages").findOne({_id: new ObjectId(id)});
            if (!page) {
                await mongoClient.close();
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
            await mongoClient.close();
            return {
                statusCode: 200,
                body: JSON.stringify(page)
            }
        }
        else if(pageUrl==="*"){
            if (!user?.roles.includes("admin")) {
                await mongoClient.close();
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
                const pages = await db.collection('pages').find().toArray();
                await mongoClient.close();
                let result = pages;
                if(preferredLanguage){
                    result = pages.map(p=>{
                        p.metadata.title = localise(p.metadata.title, preferredLanguage);
                        p.metadata.description = localise(p.metadata.description, preferredLanguage);
                        return p;
                    });
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify(result)
                }
            }
        }else {
            const page = await db.collection('pages').findOne({"url": pageUrl});
            let allPages = await db.collection('pages').find({"visible":true},{projection:{
                    "url":1,
                    "metadata.title":1,
                    "_id":1,
                    "position":1,
                }}).toArray();
            await mongoClient.close();
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
            if(page.visible || user?.roles.includes("admin")){
                let result = page;
                if(preferredLanguage){
                    result = {
                        ...page,
                        metadata: {
                            ...page.metadata,
                            title: localise(page.metadata.title, preferredLanguage),
                            description: localise(page.metadata.description, preferredLanguage)
                        }
                    }
                }
                allPages = allPages.sort((a, b) => a.position - b.position);
                let nav = {
                    "id": "nav",
                    "type": "navbar",
                    "data": {
                        "pages": allPages.map(p=>{
                            return {
                                "id": p._id,
                                "url": p.url,
                                "name": localise(p.metadata.title, preferredLanguage||"default")
                            }
                        }),
                        "user": user
                    }
                }
                if(result.components.length>0) {
                    result.components = result.components.sort((a:any, b:any) => a.position - b.position);
                    result.components = [nav, ...result.components];
                }
                else
                    result.components = [nav];
                result.userData = user;
                return {
                    statusCode: 200,
                    body: JSON.stringify(result)
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
            await mongoClient.close();
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
            await mongoClient.close();
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
            await mongoClient.close();
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
        const pages = await db.collection('pages').find({"url": page.url}).toArray();
        if(pages.length>0){
            await mongoClient.close();
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
        let pageData = {
            url: page.url,
            metadata: {
                title: page.title,
                description: page.description,
                createdAt: new Date(),
                createdBy: user._id,
                updatedAt: new Date(),
                updatedBy: user._id
            },
            components: [],
            visible: page.visible,
            position: new Date().valueOf()
        }
        const instance = await db.collection('pages').insertOne(pageData);
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                worked: instance.acknowledged,
                insertedId: instance.insertedId
            })
        }
    }
    if (event.httpMethod === 'POST'){
        if (!user?.roles.includes("admin")) {
            await mongoClient.close();
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
            await mongoClient.close();
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
        const pageData = {
            url: page.url,
            metadata: {
                title: page.title,
                description: page.description,
                updatedAt: new Date(),
                updatedBy: user._id
            },
            visible: page.visible
        }
        const instance = await db.collection('pages').updateOne(
            {_id: new ObjectId(page.id)},
            {$set: pageData},
            {upsert: false}
            );
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                worked: instance.acknowledged,
                updatedId: page.id
            })
        }
    }
    if (event.httpMethod === 'PATCH'){
        if (!user?.roles.includes("admin")) {
            await mongoClient.close();
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
            const instance = await db.collection('pages').updateOne(
                {_id: new ObjectId(data.id)},
                {$set: {visible: data.visible}},
                {upsert: false}
                );
            await mongoClient.close();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    worked: instance.acknowledged,
                    updatedId: data.id
                })
            }
        }
        else if(!data.id1||!data.id2){
            await mongoClient.close();
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
        const leftPage = await db.collection("pages").findOne({_id: new ObjectId(data.id1)});
        const rightPage = await db.collection("pages").findOne({_id: new ObjectId(data.id2)});
        if (!leftPage || !rightPage) {
            await mongoClient.close();
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
        const rightPosition = rightPage.position;
        await db.collection("pages").updateOne(
            {_id: new ObjectId(data.id1)},
            {$set: {position: rightPosition}}
        );
        await db.collection("pages").updateOne(
            {_id: new ObjectId(data.id2)},
            {$set: {position: leftPosition}}
        );
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                worked: true,
                updatedId: data.id1,
                updatedId2: data.id2
            })
        }
    }
    if (event.httpMethod === 'DELETE'){
        if (!user?.roles.includes("admin")) {
            await mongoClient.close();
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
            await mongoClient.close();
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
        const instance = await db.collection('pages').deleteOne({_id: new ObjectId(pageId)});
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify({
                worked: instance.acknowledged,
                deletedId: pageId
            })
        }
    }
    await mongoClient.close();
    return {
        statusCode: 400
    }
}

export { handler }