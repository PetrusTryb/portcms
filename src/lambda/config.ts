import { Handler } from '@netlify/functions'
import {MongoClient} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";
const handler: Handler = async (event) => {
    let mongoClient: MongoClient;
    try {
        mongoClient = await connectToDatabase();
    } catch {
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
    if(event.httpMethod==="GET"){
        const data = await db.collection("pages").findOne({"url":"*"},
            {projection:{
                url:0,
                _id:0
            }});
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify(data||{})
        }
    }
    if(event.httpMethod==="POST"){
        const data = JSON.parse(event.body||"{}")
        await db.collection("pages").updateOne({"url":"*"},{$set:data},{upsert:true})
        await mongoClient.close()
        return {
            statusCode: 204
        }
    }
    await mongoClient.close();
    return {
        statusCode: 400
    }
}
export {handler}