import { Handler } from '@netlify/functions'
import {MongoClient} from "mongodb";
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
    if (event.httpMethod === 'GET') {
        if(pageUrl==="*"){
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
            else {
                const pages = await db.collection('pages').find().toArray();
                await mongoClient.close();
                return {
                    statusCode: 200,
                    body: JSON.stringify(pages)
                }
            }
        }else {
            const pages = await db.collection('pages').find({"url": pageUrl}).toArray();
            await mongoClient.close();
            if (pages.length === 0) {
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
            return {
                statusCode: 200,
                body: JSON.stringify(pages)
            }
        }
    }
    if (event.httpMethod === 'POST') {
        //TODO
        /*return {
            statusCode: 200,
            body: `Worked: ${instance.value === 1}`
        }*/
    }
    await mongoClient.close();
    return {
        statusCode: 500,
        body: 'Unknown HTTP method'
    }
}

export { handler }