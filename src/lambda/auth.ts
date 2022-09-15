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
                        errorMessage: "Incorrect Format, Pls Try again!"
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
                    "ip": event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'],
                    "country": event.headers['x-country'],
                    "browser": event.headers['sec-ch-ua'],
                    "os": event.headers['sec-ch-ua-platform']
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
            console.log(event.headers)
            const session = {
                "id": randomUUID(),
                "created": new Date(),
                "ip": event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'],
                "country": event.headers['x-country'],
                "browser": event.headers['sec-ch-ua'],
                "os": event.headers['sec-ch-ua-platform']
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
    if (event.httpMethod === 'PATCH') {
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
        if (!event.body){
            await mongoClient.close();
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "Incorrect Format, Pls Try again!"
                    }
                })
            }
        }
        const data = JSON.parse(event.body);
        if(data.mode==="update"){
            if(!data.username || !data.email){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40002,
                            errorMessage: "No username or email provided."
                        }
                    })
                }
            }
            const userCheck = await db.collection('users').findOne({
                $or: [
                    {username: data.username},
                    {email: data.email}
                ]
            })
            if (user._id.toString()!==userCheck?._id.toString()) {
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
            await db.collection('users').updateOne({
                "sessions.id": session
            },{
                $set: {
                    "username": data.username,
                    "email": data.email,
                    "updated": new Date()
                }
            });
            await mongoClient.close();
            return {
                statusCode: 200,
                body: "{}"
            }
        }
        if(data.mode==="changePassword") {
            if (!data.password) {
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40002,
                            errorMessage: "No password provided."
                        }
                    })
                }
            }
            await db.collection('users').updateOne({
                "sessions.id": session
            }, {
                $set: {
                    "password": createHash("sha256").update(data.password).digest("hex"),
                    "updated": new Date()
                }
            });
            await mongoClient.close();
            return {
                statusCode: 200,
                body: "{}"
            }
        }
        if(data.mode==="endSession"){
            if(!data.session){
                await mongoClient.close();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40002,
                            errorMessage: "No session provided."
                        }
                    })
                }
            }
            await db.collection('users').updateOne({
                "sessions.id": session
            },{
                $pull: {
                    "sessions": {
                        "id":data.session
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
        statusCode: 400
    }
}
export { handler }