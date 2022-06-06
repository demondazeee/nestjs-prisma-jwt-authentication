import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './interface/jwt-payload';
import {hash, verify} from 'argon2'
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService
        ) {}

    // To Fetch All users from the DB, for connection testing
    async getUsers() {
        return await this.usersService.getUsers()
    }

    // To Log in user
    async signIn(res: Response, authData: AuthCredentialsDto){
        const { username, password} = authData
        
        const user = await this.usersService.getUser({username})

        if(!user){
            throw new UnauthorizedException('Invalid Username')
        }

        if(!(await verify(user.password, password))){
            throw new UnauthorizedException('Invalid Password')
        }

        const token = await this.jwt_token(res, user.id)

        return {
            ...user,
            token
        }
    }
    
    // To Register user
    async signUp(res: Response, authData: AuthCredentialsDto){
        const {password} = authData
            authData.password = await this.password_encrypt(password)
            const user = await this.usersService.createUser(authData)
            const token = await this.jwt_token(res, user.id)

            return {
                ...user,
                token
            }
    }

    // To Logout User
    async logoutUser(res: Response){
        res.cookie('rt', '', {
            expires: new Date(0),
            httpOnly: true
        })
    }

    // To Get a new access token and refresh token
    async refreshToken(req: Request, res: Response){
        try {
            const oldToken = req.cookies['rt']

            const decoded = await this.jwtService.verifyAsync(oldToken) 

            if(!decoded){
                throw new Error('Invalid Token')
            }

            const user = await this.usersService.getUser({id: decoded.id})
            
            if(!user){
                throw new Error('Invalid User')
            }

            const token = await this.jwt_token(res, user.id)

            return {
                ...user,
                token
            }
           
        } catch(e){
            throw new UnauthorizedException(e)
        }
    }

    // To Generate Jwt Token
    private async jwt_token(res: Response, id: string){
        const payload: JwtPayload = {id}

        const accessToken = await this.jwtService.signAsync(payload, {expiresIn: '15m'})
        const refreshToken = await this.jwtService.signAsync(payload)

        res.cookie('rt', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        })

        return accessToken
    }
    
    // To Hash a Password and get the Hashed Password
    private async password_encrypt(password: string){
        const salt = randomBytes(128)
        return password = await hash(password, {salt})
    }
}
