import {MongoClient} from "mongodb";
async function connectToDatabase(){
    if (process.env.MONGODB_URL === undefined)
        throw new Error("MONGODB_URL environment variable is not set. Please set it to the correct value.")
    const mongoClient = new MongoClient(process.env.MONGODB_URL, {});
    await mongoClient.connect();
    return mongoClient
}
async function checkSession(mongoClient:MongoClient, session?:string){
    if(!session) return null;
    const db = mongoClient.db("portCMS");
    const user = await db.collection('users').findOne(
        {
            sessions:
                {
                    $elemMatch:{"id":session}
                }
        }
    );
    if (!user) {
        return null;
    }
    else{
        return user;
    }
}
export {connectToDatabase, checkSession}