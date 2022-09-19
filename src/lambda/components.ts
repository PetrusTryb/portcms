import {Handler} from '@netlify/functions'
import {Db} from "mongodb";
import {checkSession, connectToDatabase} from "./mongoHelper";
import {Component} from "../classes/component";
import {Page} from "../classes/page";

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
    const user = await checkSession(db, event.headers["session"]);
    const pageId = event.queryStringParameters?.pageId;
    const componentId = event.queryStringParameters?.componentId;
    if(!user){
        return {
            statusCode: 401,
            body: JSON.stringify({
                error: {
                    errorCode: 40101,
                    errorMessage: "Unauthorized."
                }
            })
        }
    }
    if(event.httpMethod === "GET"){
        if(!componentId || !pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        const component = await Component.getById(pageId, componentId, db);
        if(!component){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40401,
                        errorMessage: "Component not found."
                    }
                })
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify(component)
        }
    }
    if(event.httpMethod === "PUT"){
        if(!pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId is required."
                    }
                })
            }
        }
        let newComponent = JSON.parse(event.body||"{}");
        if(!newComponent.type){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40002,
                        errorMessage: "Component type is required."
                    }
                })
            }
        }
        const component = new Component(newComponent.type, newComponent.data);
        await component.save(db, pageId, user._id.toString());
        return {
            statusCode: 201,
            body: "{}"
        }
    }
    if(event.httpMethod === "POST"){
        if(!componentId || !pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        let component = JSON.parse(event.body||"{}");
        let oldComponent = await Component.getById(pageId, componentId, db);
        if(!oldComponent){
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        error: {
                            errorCode: 40401,
                            errorMessage: "Component not found."
                        }
                    })
                }
        }
        oldComponent.data = component.data;
        await oldComponent.save(db, pageId, user._id.toString());
        return {
            statusCode: 200,
            body: "{}"
        }
    }
    if(event.httpMethod === "DELETE"){
        if(!componentId || !pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        let component = await Component.getById(pageId, componentId, db);
        if(!component){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40401,
                        errorMessage: "Component not found."
                    }
                })
            }
        }
        await component.delete(db, pageId, user._id.toString());
        return {
            statusCode: 200
        }
    }
    if(event.httpMethod === "PATCH"){
        if(!componentId || !pageId){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: {
                        errorCode: 40001,
                        errorMessage: "PageId and ComponentId are required."
                    }
                })
            }
        }
        const move = JSON.parse(event.body||"{'move':0}").move;
        let page = await Page.getById(pageId, db);
        if(!page){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40401,
                        errorMessage: "Page not found."
                    }
                })
            }
        }
        const component = await Component.getById(pageId, componentId, db);
        if(!component){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: {
                        errorCode: 40402,
                        errorMessage: "Component not found."
                    }
                })
            }
        }
        await component.move(db, pageId, user._id.toString(), move);
        return {
            statusCode: 205
        }
    }
    return {
        statusCode: 400
    }
}

export {handler}