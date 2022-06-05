import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interface/jwt-payload';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private userService: UsersService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const token = request.header('Authorization').replace('Bearer ', '')

      const payload = await this.jwtService.verifyAsync(token) as JwtPayload


      const user = await this.userService.getUser({id: payload.id})

      if(!user){
        throw new Error()
      }

      request['user'] = user
      return true;
    } catch(e){
      throw new UnauthorizedException('Unautorized User')
    }
  }
}