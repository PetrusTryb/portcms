import {MongoClient} from "mongodb";
async function connectToDatabase(){
    if (process.env.MONGODB_URL === undefined)
        throw new Error("MONGODB_URL environment variable is not set. Please set it to the correct value.")
    const mongoClient = new MongoClient(process.env.MONGODB_URL, {});
    await mongoClient.connect();
    return mongoClient
}
export {connectToDatabase}