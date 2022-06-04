import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory(config: ConfigService){
      return {
        secret: config.get('JWT_KEY')
      }
    }
  })],
  providers: [AuthService, PrismaService, UsersService],
  controllers: [AuthController]
})
export class AuthModule {}
