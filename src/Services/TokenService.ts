import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) { }

    async getTokens(userId: string, name: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    name,
                },
                {
                    secret: process.env.ACCESS_TOKEN_SECRET,
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    name,
                },
                {
                    secret: process.env.REFRESH_TOKEN_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }
}