import { Controller, Get, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    
    constructor (
        private usersService: UsersService
    ){}

    // FOR DB Connection Testing
    @Get('/')
    @HttpCode(200)
    async getUsers(){
        return this.usersService.getUsers()
    }
}
