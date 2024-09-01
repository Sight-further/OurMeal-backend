import { Body, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserDto } from './dto/user.dto'; import { DataService } from './db/data.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly dataService: DataService) {}

    @Get('signin') //loginUserCheck에서 available이면 실행
    async login(@Query('id') id: string, @Query('pw') pw: string, @Res() res: Response) {
        res.status(200).send(await this.authService.loginUser(id, pw));
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
    async logout(@Query('id') id, @Query('pw') pw, @Query('redirect') red, @Res() res: Response) {
        const result = await this.authService.logoutUser(id, pw)
        res.status(200).send(result)
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
