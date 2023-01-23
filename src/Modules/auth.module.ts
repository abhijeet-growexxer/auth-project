import { Module } from '@nestjs/common';
import { AuthController } from '../Controllers/auth.controller';
import { AuthService } from '../Services/authService';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from 'src/Strategies/accessToken.strategies';
import { RefreshTokenStrategy } from 'src/Strategies/refreshToken.Strategies';
import { TokenService } from '../utils/TokenService';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, TokenService],
})
export class AuthModule { }
