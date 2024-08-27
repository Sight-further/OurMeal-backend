import { Body, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('signin')
    async login(@Query('id') id: string, @Query('pw') pw: string, @Query('userToken') tkn: string, @Query('redirect') red, @Res() res: Response) {
        const result = await this.authService.loginUser(id, pw, tkn); //토큰은 sha-256으로 암호화 후 대조.
        await this.authService.createSession(await this.authService.getTokenById(id))
        res.redirect(red)
    }

    @Get('signout')
    async logout(@Query('token') tkn, @Query('redirect') red, @Res() res: Response) {
        const result = await this.authService.logoutUser(tkn);
        await this.authService.deleteSession(tkn)
        res.redirect(red)
    }

    @Get('createUser') // 서버용
    async create(@Body() usrDto: UserDto) {
        const result = await this.authService.createUser(usrDto)
        return result
    }
}
