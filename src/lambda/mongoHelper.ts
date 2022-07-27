import {MongoClient, ObjectId} from "mongodb";
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
        },{
            projection: {
                username: 1,
                roles: 1,
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

async function swapPositions(area: "pages"|"components", n: MongoClient, left: string, right: string){
    if(left === right) return;
    if(area==="pages") {
        const db = n.db("portCMS");
        const leftPage = await db.collection("pages").findOne({_id: new ObjectId(left)});
        const rightPage = await db.collection("pages").findOne({_id: new ObjectId(right)});
        if (!leftPage || !rightPage) {
            throw new Error("Could not find page with id " + left + " or " + right);
        }
        const leftPosition = leftPage.position;
        const rightPosition = rightPage.position;
        await db.collection("pages").updateOne(
            {_id: new ObjectId(left)},
            {$set: {position: rightPosition}}
        );
        await db.collection("pages").updateOne(
            {_id: new ObjectId(right)},
            {$set: {position: leftPosition}}
        );
    }
    else if(area==="components") {
        //TODO
    }
}

export {connectToDatabase, checkSession, swapPositions}