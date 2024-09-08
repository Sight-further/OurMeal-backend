import { Body, Controller, Get, Param, Query, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserDto } from './dto/user.dto'; import { DataService } from './db/data.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly dataService: DataService) {}

    @Get('signin') //loginUserCheck에서 available이면 실행
    async login(@Query('id') id: string, @Query('pw') pw: string, @Req() req: Request, @Res() res: Response) {
        if (await this.authService.getSession(req.cookies["SESSION_ID"]) == null || req.cookies["SESSION_ID"] == null) {
            const sessionId = await this.authService.loginUser(id, pw);
            res.cookie('SESSION_ID', sessionId);
            res.status(200).send("success. redirecting to the main page..");
        } else {
            res.status(200).send({status: `logged in already: ${(await this.authService.getUserBytoken(await this.authService.getTokenById(id))).nickname}`})
        }
    }

    @Get('signinUserCheck') //서버용
    async loginUser(@Query('id') id: string, @Query('pw') pw: string) {
        if (await this.authService.getUser(id, pw)) {
            return {login: "available"}
        } else {
            return {login: "cannot"}
        }
    }

    @Get('signout')
    async logout(@Query('id') id, @Query('pw') pw, @Query('redirect') red, @Req() req: Request, @Res() res: Response) {
        const sessionId = req.cookies['SESSION_ID'];
        if (sessionId == null) {
            const result = await this.authService.logoutUser(id, pw);
            res.status(200).send(result);
            res.clearCookie("SESSION_ID")
        } else {

        }
    }

    @Get('createUser') // 서버용
    async create(@Body() usrDto: UserDto) {
        const result = await this.authService.createUser(usrDto);
        return result;
    }

    @Get('isExists')
    async isExists(@Query('nickname') nickname, @Query('id') id) {
        if (id && !nickname) {
            if (this.authService.isAlreadyExists(id, id)) {
                return {exist: true};
            } else {
                return {exist: false};
            }
        } else if (!id && nickname) {
            if (this.authService.isAlreadyExists(nickname, nickname)) {
                return {exist: true};
            } else {
                return {exist: false};
            }
        }
    }

    @Get('updateSchool')
    async updateSchool(@Query('nickname') nickname, @Query('school') school) {
       await this.dataService.upsertOne({nickname: nickname}, {school: school}).then(() => {
            return {status: "success"}
       }).catch(() => {
            return {status: "failed"}
       })
    }

    @Get('getUserToken') // 서버용
    async getUserToken(@Query('id') id) {
        return {id: await this.authService.getTokenById(id)}
    }
}
