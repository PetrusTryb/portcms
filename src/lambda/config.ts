import { Handler } from '@netlify/functions'
import {Db} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";
import {WebsiteConfig} from "../classes/config";

const handler: Handler = async (event) => {
    let db:Db;
    try {
        db = await connectToDatabase();
    } catch {
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
    const user = await checkSession(db, event.headers["session"]);
    if(event.httpMethod==="GET"){
        let data = await WebsiteConfig.getCurrentConfig(db);
        if(!user?.roles.includes("admin")&&data)
            return {
                statusCode: 200,
                body: data.renderManifest()
            }
        return {
            statusCode: 200,
            body: JSON.stringify(data||{})
        }
    }
    if(event.httpMethod==="POST"){
        if (!user?.roles.includes("admin")) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error: {
                        errorCode: 40301,
                        errorMessage: "You have insufficient permissions. File do not Written."
                    }
                })
            }
        }
        const data = JSON.parse(event.body||"{}")
        if(!data.metadata||!data.pwa){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "Invalid data."
                    }
                })
            }
        }
        const config = await WebsiteConfig.getCurrentConfig(db);
        config.metadata.title = data.metadata.title;
        config.metadata.logo = data.metadata.logo;
        config.metadata.smallLogo = data.metadata.smallLogo;
        config.pwa.name = data.pwa.name;
        config.pwa.shortName = data.pwa.short_name;
        config.pwa.displayMode = data.pwa.display;
        config.pwa.icons = data.pwa.icons;
        config.visible = data.visible;
        await config.save(db);
        return {
            statusCode: 200
        }
    }
    return {
        statusCode: 400
    }
}
export {handler}