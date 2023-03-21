import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileController } from "src/Controllers/profile.controller";
import { User, UserSchema } from "src/Schemas/User.schema";
import { ProfileService } from "src/Services/profileService";
import { TokenService } from "src/Services/TokenService";
import { AccessTokenStrategy } from "src/Strategies/accessToken.strategies";
import { RefreshTokenStrategy } from "src/Strategies/refreshToken.strategies";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({}),
    ],
    controllers: [ProfileController],
    providers: [ProfileService, AccessTokenStrategy, RefreshTokenStrategy, TokenService]
})
export class ProfileModule { }