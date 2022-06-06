import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) {}

    // Get All Users
    async getUsers(){
        try {
            const users = await this.prisma.users.findMany()
            
            if (users){
                return users
            }
        } catch(e){
            throw new InternalServerErrorException(e)
        }
    }

    // Get User By Id or Username
    async getUser(userdata: Prisma.UsersWhereUniqueInput){
        const user = await this.prisma.users.findUnique({
            where: userdata
        })
        
        return user
    }

    // Create User
    async createUser(data: Prisma.UsersCreateInput){
        try {
            const user = await this.prisma.users.create({
                data
            })

            console.log(user)
            return user
        } catch(e){
            throw new ConflictException('Existing Username')
        }
    }

    // Update User
    async updateUser(id: Prisma.UsersWhereUniqueInput,data: Prisma.UsersUpdateInput){
        await this.getUser(id)
        try{
            const result = await this.prisma.users.update({
                where: id,
                data
            })

            return result
        } catch(e){
            throw new InternalServerErrorException(e)
        }
    }

    // Delete User
    async deleteUser(id: Prisma.UsersWhereUniqueInput){
        await this.getUser(id)
        try {
            const result = await this.prisma.users.delete({
                where: id
            })

            return result
        } catch(e){
            throw new InternalServerErrorException(e)
        }
    }

}
