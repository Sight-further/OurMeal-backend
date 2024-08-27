import { Injectable } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class AuthService {
    async createUser(userDto: UserDto) {}
    async getUserBytoken(token: string) {}
    async getTokenById(id: string): Promise<string> { return "" }
    async isAlreadyExists(key: string, value: any) {}
    async updateInfo(token: string) {}
    async loginUser(id: string, pw: string, token: string) {
        return Result.success
    }
    async logoutUser(token: string) {}
    async createSession(token: string) {}
    async getSession(token: string) {}
    async deleteSession(token: string) {}
}