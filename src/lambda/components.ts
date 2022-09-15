import {Handler} from '@netlify/functions'
import {MongoClient, ObjectId} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";

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
    const user = await checkSession(mongoClient, event.headers["session"]);
    const pageId = event.queryStringParameters?.pageId;
    const componentId = event.queryStringParameters?.componentId;
    if(!user){
        await mongoClient.close();
        return {
            statusCode: 401,
            body: JSON.stringify({
                error: {
                    errorCode: 40101,
                    errorMessage: "Unauthorized."
                }
            })
        }
    }
    if(event.httpMethod === "GET"){
        if(!componentId || !pageId){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        const page = await db.collection("pages").findOne({_id: new ObjectId(pageId)});
        if(!page){
            await mongoClient.close();
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
        const component = page.components.filter((c:any) => c.id.toString() === componentId);
        await mongoClient.close();
        return {
            statusCode: component.length > 0 ? 200 : 404,
            body: JSON.stringify(component.length > 0 ? component[0] : {})
        }
    }
    if(event.httpMethod === "PUT"){
        if(!pageId){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId is required."
                    }
                })
            }
        }
        let newComponent = JSON.parse(event.body||"{}");
        if(!newComponent.type){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40002,
                        errorMessage: "Component type is required."
                    }
                })
            }
        }
        newComponent.position = new Date().getTime(); //using timestamp as last position
        newComponent.id = new ObjectId(); //random object id
        await db.collection("pages").updateOne({_id: new ObjectId(pageId)}, {
            $push: {components: newComponent},
            $set: {"metadata.updatedAt": new Date(), "metadata.updatedBy": user._id}
        });
        await mongoClient.close();
        return {
            statusCode: 201,
            body: JSON.stringify(newComponent)
        }
    }
    if(event.httpMethod === "POST"){
        if(!componentId || !pageId){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        let component = JSON.parse(event.body||"{}");
        console.log(component);
        await db.collection("pages").updateOne({_id: new ObjectId(pageId), "components.id": new ObjectId(componentId)}, {
            $set: {"components.$.data": component.data, "metadata.updatedAt": new Date(), "metadata.updatedBy": user._id}
        });
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify(component)
        }
    }
    if(event.httpMethod === "DELETE"){
        if(!componentId || !pageId){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        await db.collection("pages").updateOne({_id: new ObjectId(pageId)}, {
            $pull: {components: {id: new ObjectId(componentId)}},
            $set: {"metadata.updatedAt": new Date(), "metadata.updatedBy": user._id}
        });
        await mongoClient.close();
        return {
            statusCode: 200,
            body: "File Written"
        }
    }
    if(event.httpMethod === "PATCH"){
        if(!componentId || !pageId){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        const move = JSON.parse(event.body||"{'move':0}").move;
        const page = await db.collection("pages").findOne({_id: new ObjectId(pageId)});
        if(!page){
            await mongoClient.close();
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
        const prevComponents = [...page.components];
        const components = page.components.sort((a:any, b:any) => a.position - b.position);
        const component = components.filter((c:any) => c.id.toString() === componentId);
        if(!component.length){
            await mongoClient.close();
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40402,
                        errorMessage: "Component not found."
                    }
                })
            }
        }
        const componentIndex = components.indexOf(component[0]);
        if(move === 0){
            await mongoClient.close();
            return {
                statusCode: 204,
                body: "No action taken."
            }
        }
        if(move === -1){
            if(componentIndex === 0){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40003,
                            errorMessage: "Cannot move component up."
                        }
                    })
                }
            }
        }
        if(move === 1){
            if(componentIndex === components.length - 1){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40004,
                            errorMessage: "Cannot move component down."
                        }
                    })
                }
            }
        }
        const nextComponent = components[componentIndex + move];
        const leftComponentIndex = prevComponents.indexOf(component[0]);
        const rightComponentIndex = prevComponents.indexOf(nextComponent);
        const leftQuery = `components.${leftComponentIndex}.position`
        const rightQuery = `components.${rightComponentIndex}.position`
        const leftValue = prevComponents[leftComponentIndex].position;
        const rightValue = prevComponents[rightComponentIndex].position;
        await db.collection("pages").updateOne({_id: new ObjectId(pageId)}, {
            $set: {
                [leftQuery]: rightValue,
                [rightQuery]: leftValue,
                "metadata.updatedAt": new Date(),
                "metadata.updatedBy": user._id
            }
        });
        await mongoClient.close();
        return {
            statusCode: 205
        }
    }
    await mongoClient.close();
    return {
        statusCode: 400
    }
}

export {handler}