import { Injectable } from "@nestjs/common";
import { Collection, Db, MongoClient } from "mongodb";
import { config } from "dotenv";import { UserDto } from "../dto/user.dto";
 config();

const env = process.env
@Injectable()
export class DataService {
    private client: MongoClient
    db: Db
    coll: Collection<Document>

    async connect() {
        this.client = new MongoClient(env.DB_URL);
        await this.client.connect();
        this.db = this.client.db(env.DB_NAME)
        this.coll = this.db.collection(env.COLLECTION_NAME)
    }

    async isAlreadyExists(filter: any): Promise<Boolean> {
        const document = await this.coll.findOne(filter)
        if (document != null) {
            return true
        }
        return false
    }

    async findOne(filter: any): Promise<UserDto | null> {
        const document = await this.coll.findOne(filter);
        return document as unknown as UserDto | null;
    }

    async upsertOne(fData: any, updateData: any) {
        const found = await this.findOne(fData);
        if (found) {
            await this.coll.updateOne(fData, { $set: updateData });
        } else {
            await this.coll.insertOne(updateData);  
        }
    }

} 