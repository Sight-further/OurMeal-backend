import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { DataService } from "./db/data.service";
import { v4 as uuidv4 } from 'uuid';
import { config } from "dotenv";import { SessionDto } from "./dto/session.dto";
import * as bcrypt from "bcrypt";
config();

const env = process.env;
@Injectable()
export class AuthService {
    constructor(private readonly dataService: DataService) {}

    async generateRandomString(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+~';
        let result = '';
        const charactersLength = characters.length;
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return result;
    }

    async createUser(userDto: UserDto) {
        await this.dataService.connect().then(() => { console.log("MongoDbConnection Succeed."); }).catch(() => { console.log("MongoConnection Was Occurred an Error") });

        const nickCheck = await this.dataService.isAlreadyExists({ nickname: userDto.nickname });
        if (nickCheck) {
            return;
        }

        const idCheck = await this.dataService.isAlreadyExists({ id: userDto.id });
        if (idCheck) {
            return;
        }

        let uid = await this.generateRandomString(80);
        const uidValidationCheck = await this.dataService.isAlreadyExists({ token: userDto.token });

        while (uidValidationCheck) { uid = await this.generateRandomString(80); }
        const pw = await bcrypt.hash(userDto.pw as string, 10)
        await this.dataService.upsertOne(
            {
                nickname: userDto.nickname
            },
          
            {
                id: userDto.id,
                pw: pw, 
                token: uid,
                nickname: userDto.nickname,
                perm: userDto.perm,
                email: userDto.email || "null yet",
                school: userDto.school || "null yet" 
            }
        ).then(() => {
            return Result.success;
        }).catch(() => {
            return Result.fail;
        })
    }

    async getUser(id: string, pw: string) {
        if (await this.getTokenById(id) == null) {
            return false
        }
        return await this.comparePassword(pw, (await this.getUserBytoken(await this.getTokenById(id))).pw)
    }

    async getUserBytoken(token: string) {
        return await this.dataService.findOne({token: token});
    }

    async getTokenById(id: string) {
        if (await this.dataService.findOne({id: id}) == null) {
            return null;
        }
        return (await this.dataService.findOne({id: id})).token;
    }

    async isAlreadyExists(key: string, value: any) {
        return await this.dataService.isAlreadyExists({key: value});
    }
    async updateInfo(token: string) {}

    async comparePassword(password: string, hashed: string) {
        if (hashed == null || password == null) {
            return false;
        }
        return await bcrypt.compare(password, hashed);
    }
    async loginUser(id: string, pw: string) {
        if (await this.getUser(id, pw)) {
            const result = await this.createSession(await this.getTokenById(id));
            return {sessionId: result}
        } else {
            return {sessionId: "NON_EXIST"}
        }
    }

    async logoutUser(id: string, pw: string) {
        if (await this.getUser(id, pw)) {
            const result = await this.deleteSession(await this.getTokenById(id));
            return {result: Result.success};
        } else {
            return {result: Result.fail};
        }
    }
    
    async createSession(token: string): Promise<string> {
        const sessionId = uuidv4()
        this.dataService.db.collection(env.SESSION_DB_NAME).insertOne({
            sessionId,
            token,
            createdAt: new Date(),
        });
        return sessionId;
    }

    async getSession(sessionId: string): Promise<SessionDto | null> {
        const doc = await this.dataService.db.collection(env.SESSION_DB_NAME).findOne({ sessionId });
        if (doc != null) {
            return doc as SessionDto;
        } else {
            return null;
        }
    }

    async deleteSession(sessionId: string) {
        await this.dataService.db.collection(env.SESSION_DB_NAME).deleteOne({ sessionId }); 
    }
    
}
