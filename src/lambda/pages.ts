import { Handler } from '@netlify/functions'
import {MongoClient} from "mongodb";

const handler: Handler = async (event, context) => {
    // Installation check - environment variable is set
    if (process.env.MONGODB_URL === undefined )
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    errorCode: "MONGODB_URL_NOT_SET",
                    errorMessage: "MONGODB_URL environment variable is not set. Please set it to the correct value."
                }
            })
        }
    const mongoClient = new MongoClient(process.env.MONGODB_URL, {  });
    try {
        await mongoClient.connect();
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    errorCode: "MONGODB_CONNECTION_ERROR",
                    errorMessage: "Failure to connect to MongoDB. Please check the MONGODB_URL environment variable."
                }
            })
        }
    }
    const db = mongoClient.db("portCMS");
    // Installation check - database exists
    if (!(await db.listCollections().toArray()).find(c => c.name === "pages"))
        await mongoClient.close();
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    errorCode: "MONGODB_DATABASE_NOT_FOUND",
                    errorMessage: "PortCMS is not yet installed."
                }
            })
        }
    const pageUrl = event.queryStringParameters?.url;
    if (event.httpMethod === 'GET') {
        const pages = await db.collection('pages').find({"url":pageUrl}).toArray();
        await mongoClient.close();
        return {
            statusCode: 200,
            body: JSON.stringify(pages)
        }
    }
    if (event.httpMethod === 'POST') {

    }
    await mongoClient.close();
    return {
        statusCode: 500,
        body: 'Unknown HTTP method'
    }
}

export { handler }