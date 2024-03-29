import { Handler } from '@netlify/functions'
import {Db} from "mongodb";
import {connectToDatabase} from "./mongoHelper";
import {createHash} from "crypto";
import {User} from "../classes/user";

const handler: Handler = async (event) => {
    let db:Db;
    try {
        db = await connectToDatabase();
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
    const session = event.headers["session"];
    if (event.httpMethod === 'GET') {
        const user = await User.getBySession(db, session);
        if (!user) {
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
        else {
            return {
                statusCode: 200,
                body: JSON.stringify(user)
            }
        }
    }
    if (event.httpMethod === 'POST') {
       if (!event.body){
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
            const newUser = new User();
            if(!await newUser.changeUsername(db, data.username) || !await newUser.changeEmail(db, data.email)){
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
            await newUser.changePassword(db, data.password);
            await newUser.addSession(db, event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || "", event.headers['sec-ch-ua']||event.headers["user-agent"]||"");
            await newUser.save(db);
            return {
                statusCode: 201,
                body: JSON.stringify(newUser.sessions[0])
            }
        }
        if(data.mode==="login"){
            if(!data.email || !data.password){
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
            const user = await User.getByEmailAndPassword(db, data.email, data.password);
            if (!user) {
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
            await user.addSession(db, event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || "", event.headers['sec-ch-ua']||event.headers["user-agent"]||"");
            await user.save(db);
            return {
                statusCode: 200,
                body: JSON.stringify(user.sessions[user.sessions.length-1])
            }
        }
        if(data.mode==="logout"){
            const user = await User.getBySession(db, session);
            if (!user||!session) {
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
            await user.removeSession(db, session);
            await user.save(db);
            return {
                statusCode: 200,
                body: "{}"
            }
        }
    }
    if (event.httpMethod === 'PATCH') {
        const user = await User.getBySession(db, session);
        if (!user) {
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
            if(!await user.changeUsername(db, data.username) || !await user.changeEmail(db, data.email)){
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
            await user.save(db);
            return {
                statusCode: 200,
                body: "{}"
            }
        }
        if(data.mode==="changePassword") {
            if (!data.password) {
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
            return {
                statusCode: 200,
                body: "{}"
            }
        }
        if(data.mode==="endSession"){
            if(!data.session){
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
            return {
                statusCode: 200,
                body: "{}"
            }
        }
    }
    return {
        statusCode: 400
    }
}
export { handler }