import {Db, ObjectId} from "mongodb";
import {createHash, randomUUID} from "crypto";

export class User {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    sessions: Array<{
        id: string;
        created: Date;
        ip: string;
        userAgent: string;
    }>;
    created: Date;
    updated: Date;
    roles: Array<string>;

    constructor(_id?: ObjectId, username?: string, password?: string, email?: string, sessions?: Array<{
        id: string;
        created: Date;
        ip: string;
        userAgent: string;
    }>, created?: Date, updated?: Date, roles?: Array<string>) {
        this._id = _id || new ObjectId();
        this.username = username||"";
        this.password = password||"";
        this.email = email||"";
        this.sessions = sessions||[];
        this.created = created||new Date();
        this.updated = updated||new Date();
        this.roles = roles||[];
    }

    static async getBySession(db: Db, session?: string) {
        if (!session)
            return null;
        const user = await db.collection('users').findOne(
            {
                sessions:
                    {
                        $elemMatch:{"id":session}
                    }
            })
        if (!user)
            return null;
        else
            return new User(user._id, user.username, user.password, user.email, user.sessions, user.created, user.updated, user.roles);
    }

    static async getById(db: Db, id: ObjectId) {
        const user = await db.collection('users').findOne(
            {
                _id: id
            })
        if (!user)
            return null;
        else
            return new User(user._id, user.username, user.password, user.email, user.sessions, user.created, user.updated, user.roles);
    }

    static async getByEmailAndPassword(db: Db, email: string, password: string) {
        const user = await db.collection('users').findOne({
            email: email,
            password: createHash("sha256").update(password).digest("hex")
        })
        if (!user)
            return null;
        else
            return new User(user._id, user.username, user.password, user.email, user.sessions, user.created, user.updated, user.roles);
    }

    async changePassword(db: Db, password: string) {
        this.password = createHash("sha256").update(password).digest("hex");
    }

    async changeUsername(db: Db, username: string) {
        if(!username)
            return false;
        const userCheck = await db.collection('users').findOne({
            username: username
        })
        if (userCheck?._id.toString()!==this._id.toString() && userCheck)
            return false;
        this.username = username;
        return true;
    }

    async changeEmail(db: Db, email: string) {
        if(!email)
            return false;
        const userCheck = await db.collection('users').findOne({
            email: email
        })
        if (userCheck?._id.toString()!==this._id.toString() && userCheck)
            return false;
        this.email = email;
        return true;
    }

    async addSession(db: Db, ip: string, userAgent: string) {
        this.sessions.push({
            id: randomUUID(),
            created: new Date(),
            ip: ip,
            userAgent: userAgent
        });
    }

    async removeSession(db: Db, session: string) {
        this.sessions = this.sessions.filter((s)=>{
            return s.id!==session;
        });
    }

    async save(db: Db) {
        this.updated = new Date();
        await db.collection('users').updateOne({
            _id: this._id
        },{
            $set: this
        }, {
            upsert: true
        });
    }
}