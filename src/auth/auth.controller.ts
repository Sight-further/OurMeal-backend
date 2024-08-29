import { Body, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('signin') //loginUserCheck에서 available이면 실행
    async login(@Query('id') id: string, @Query('pw') pw: string, @Query('userToken') tkn: string, @Query('redirect') red, @Res() res: Response) {
        const result = await this.authService.loginUser(id, pw, tkn).then(async () => {
            await this.authService.createSession(await this.authService.getTokenById(id));
            res.redirect(red)
        }).catch(() => {
            res.status(404).send({login: "failed", cause: "NOT_FOUND"});
        })
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
    async logout(@Query('token') tkn, @Query('redirect') red, @Res() res: Response) {
        const result = await this.authService.logoutUser(tkn).then(async () => {
            await this.authService.deleteSession(tkn);
            res.redirect(red);
        })
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
}
