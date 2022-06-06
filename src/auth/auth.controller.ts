import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserInfo } from '../users/decorator/user-info.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from './guards/auth.guard';
import { TransformInterceptor } from './interceptor/user-info.interceptor';

@Controller('auth')
//@UseInterceptors(TransformInterceptor)
export class AuthController {

    constructor (
        private authService: AuthService
    ) {}

    // For Testing: GET '/' to Fetch All users from the DB, for connection testing
    @Get('/')
    @HttpCode(200)
    async getUsers(){
        return this.authService.getUsers()
    }

    // For Testing: GET '/info' to Fetch the current logged in user
    // Requirements: Need to have a Bearer Token from request header
    @UseGuards(AuthGuard)
    @Get('/info')
    @HttpCode(200)
    async userInfo(@UserInfo() user: {id: string, username: string}){
        return user
    }

    // POST '/signup' to Register User
    @Post('/signup')
    @HttpCode(201)
    async signUpUser(@Body() authDto: AuthCredentialsDto, @Res({passthrough: true}) res: Response){
        return this.authService.signUp(res, authDto)
    }

    // POST '/signin' to Login User
    @Post('/signin')
    @HttpCode(200)
    async signInUser(@Body() authDto: AuthCredentialsDto, @Res({passthrough: true}) res: Response){
        return this.authService.signIn(res, authDto)
    }

    // POST '/logout' to Logout User
    @Post('/logout')
    @HttpCode(200)
    async logout(@Res({passthrough: true}) res: Response){
        return this.authService.logoutUser(res)
    }

    // GET '/refresh-token' to fetch a new access token and refresh token
    @Get('/refresh-token')
    @HttpCode(200)
    async refreshToken(@Req() req: Request, @Res({passthrough: true}) res: Response){
        return this.authService.refreshToken(req, res)
    }


}
