import { Handler } from '@netlify/functions'
import {MongoClient} from "mongodb";
import {connectToDatabase} from "./mongoHelper";
import {createHash, randomUUID} from "crypto";

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
    if (event.httpMethod === 'GET') {
        const session = event.headers["session"];
        if (!session) {
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "No session provided."
                    }
                })
            }
        }
        const user = await db.collection('users').findOne(
            {
                sessions:
                    {
                        $elemMatch:{"id":session}
                    }
            }
        );
        if (!user) {
            await mongoClient.close();
            return {
                statusCode: 401,
                body: JSON.stringify({
                    error: {
                        errorCode: 40101,
                        errorMessage: "Invalid session."
                    }
                })
            }
        }
        else{
            await mongoClient.close();
            return {
                statusCode: 200,
                body: JSON.stringify(user)
            }
        }
    }
    if (event.httpMethod === 'POST') {
       if (!event.body){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40201,
                        errorMessage: "Invalid request body - no data provided."
                    }
                })
            }
       }
        const data = JSON.parse(event.body);
        if(data.mode==="register"){
            if(!data.username || !data.password || !data.email){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40202,
                            errorMessage: "No username, password or email provided."
                        }
                    })
                }
            }
            const user = await db.collection('users').findOne({
                $or: [
                    {username: data.username},
                    {email: data.email}
                ]
            })
            if (user) {
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40203,
                            errorMessage: "Username or email already in use."
                        }
                    })
                }
            }
            const newUser = {
                "username": data.username,
                "password": createHash("sha256").update(data.password).digest("hex"),
                "email": data.email,
                "sessions": [{
                    "id": randomUUID(),
                    "created": new Date(),
                    "ip": event.headers['client-ip']
                }],
                "created": new Date(),
                "updated": new Date(),
                "roles": await db.collection('users').countDocuments()===0 ? ["admin"] : [],
            }
            await db.collection('users').insertOne(newUser);
            await mongoClient.close();
            return {
                statusCode: 201,
                body: JSON.stringify(newUser.sessions[0])
            }
        }
        if(data.mode==="login"){
            if(!data.username || !data.password || !data.device){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40204,
                            errorMessage: "No username, password or device info provided."
                        }
                    })
                }
            }
            const user = await db.collection('users').findOne({
                "email": data.email,
                "password": createHash("sha256").update(data.password).digest("hex")
            });
            if (!user) {
                await mongoClient.close();
                return {
                    statusCode: 401,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40205,
                            errorMessage: "Login details are not correct."
                        }
                    })
                }
            }
            const session = randomUUID();
            await db.collection('users').updateOne({
                "_id": user._id
            },{
                $push: {
                    "sessions": session
                }
            });
            await mongoClient.close();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    "session": {
                        "id": session,
                        "created": new Date(),
                        "device": data.device
                    }
                })
            }
        }
        if(data.mode==="logout"){
            if(!data.session){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40206,
                            errorMessage: "No session provided."
                        }
                    })
                }
            }
            const user = await db.collection('users').findOne({
                "session": {
                    "id": data.session,
                }
            });
            if (!user) {
                await mongoClient.close();
                return {
                    statusCode: 401,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40207,
                            errorMessage: "Invalid session."
                        }
                    })
                }
            }
            await db.collection('users').updateOne({
                "_id": user._id
            },{
                $pull: {
                    "sessions": {
                        "id": data.session
                    }
                }
            });
            await mongoClient.close();
            return {
                statusCode: 200,
                body: "Logout successful."
            }
        }
        }

    await mongoClient.close();
    return {
        statusCode: 500,
        body: 'Unknown HTTP method'
    }
}
export { handler }