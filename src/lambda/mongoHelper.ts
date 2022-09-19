import {Db, MongoClient} from "mongodb";
if (process.env.MONGODB_URL === undefined)
    throw new Error("MONGODB_URL environment variable is not set. Please set .env file in the root directory of the project that will be read by Environment File Reader.");
const mongoClient = new MongoClient(process.env.MONGODB_URL, {});
const connectPromise = mongoClient.connect();
async function connectToDatabase(){
    return (await connectPromise).db(process.env.MONGODB_DB_NAME||"portCMS");
}
async function checkSession(db:Db, session?:string){
    if(!session) return null;
    const user = await db.collection('users').findOne(
        {
            sessions:
                {
                    $elemMatch:{"id":session}
                }
        },{
            projection: {
                username: 1,
                email: 1,
                roles: 1,
                sessions: 1
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