import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { DataService } from "./db/data.service";
import { v4 as uuidv4 } from 'uuid';
import { config } from "dotenv";import { SessionDto } from "./dto/session.dto";
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
        await this.dataService.upsertOne(
            {
                nickname: userDto
            },
          
            {
                id: userDto.id,
                pw: userDto.pw, // 암호화 작업 필요
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

    async getUserBytoken(token: string) {
        return await this.dataService.findOne({token: token});
    }

    async getTokenById(id: string) { 
        return (await this.dataService.findOne({id: id})).token;
    }

    async isAlreadyExists(key: string, value: any) {
        return await this.dataService.isAlreadyExists({key: value});
    }
    async updateInfo(token: string) {}

    async loginUser(id: string, pw: string, token: string) {
        return Result.success;
    }
    async logoutUser(token: string) {}
    
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
