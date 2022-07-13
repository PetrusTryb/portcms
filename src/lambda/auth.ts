import { Handler } from '@netlify/functions'
import {MongoClient} from "mongodb";
import {connectToDatabase, checkSession} from "./mongoHelper";
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
    const session = event.headers["session"];
    if (event.httpMethod === 'GET') {
        const user = await checkSession(mongoClient, session);
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
                        errorCode: 40001,
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
                            errorCode: 40002,
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
                            errorCode: 40003,
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
                "roles": await db.collection('users').countDocuments()===0 ? ["admin"] : ["user"],
            }
            await db.collection('users').insertOne(newUser);
            await mongoClient.close();
            return {
                statusCode: 201,
                body: JSON.stringify(newUser.sessions[0])
            }
        }
        if(data.mode==="login"){
            if(!data.email || !data.password){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40004,
                            errorMessage: "No email or password provided."
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
                    statusCode: 403,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40301,
                            errorMessage: "Login details are not correct."
                        }
                    })
                }
            }
            const session = {
                "id": randomUUID(),
                "created": new Date(),
                "ip": event.headers['client-ip']
            }
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
                body: JSON.stringify(session)
            }
        }
        if(data.mode==="logout"){
            const user = await checkSession(mongoClient, session);
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
            await db.collection('users').updateOne({
                "_id": user._id
            },{
                $pull: {
                    "sessions": {
                        "id":session
                    }
                }
            });
            await mongoClient.close();
            return {
                statusCode: 200,
                body: "{}"
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