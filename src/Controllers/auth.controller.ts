import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../Services/authService';
import { UserSignUpModel, UserSignInModel } from '../Models/UserModels';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/Guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/Guards/refreshToken.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 200, description: 'Registration successful' })
    async signUp(@Body() userDetails: UserSignUpModel) {
        return this.authService.signUp(userDetails);
    }

    @Post('/login')
    @ApiOperation({ summary: 'User login with email and password' })
    @ApiResponse({ status: 200, description: 'Login Successful' })
    async signIn(@Body() userDetails: UserSignInModel) {
        return this.authService.signIn(userDetails);
    }

    @Get('/me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Details of current logged in user' })
    @UseGuards(AccessTokenGuard)
    async getUser(@Req() req: Request) {
        return this.authService.getUser(req.user['sub']);
    }

    @UseGuards(AccessTokenGuard)
    @Post('/logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Log out the current logged in user' })
    async logout(@Req() req: Request) {
        return this.authService.logout(req.user['sub']);
    }

    @Get('/refreshToken/')
    @ApiBearerAuth()
    @UseGuards(RefreshTokenGuard)
    @ApiOperation({ summary: 'Replace a token with a new one' })
    async refreshToken(@Req() req: Request) {
        return this.authService.refreshTokens(
            req.user['sub'],
            req.user['refreshToken'],
        );
    }

    @Post('/verify-otp/:otp')
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Verifies user account of the current logged in user' })
    async verifyOTP(
        @Req() req: Request,
        @Query('otp') otp: number
    ) {
        return this.authService.verifyOTP(req.user['sub'], otp);
    }

    @Post('/forgot-password/:email')
    @ApiOperation({ summary: 'Verifies user account of the current logged in user' })
    async forgotPassword(
        @Query('email') email: string,
    ) {
        return this.authService.forgotPassword(email);
    }

    @Post('/confirm-otp/:email/:otp')
    @ApiOperation({ summary: 'Verifies user account of the current logged in user' })
    async confirmOTP(
        @Query('email') email: string,
        @Query('otp') otp: number
    ) {
        return this.authService.confirmOTP(email, otp);
    }

    @Post('/update-password/:password')
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Replace a token with a new one' })
    async updatePassword(
        @Req() req: Request,
        @Query('password') password: string
    ) {
        return this.authService.updatePassword(
            req.user['sub'],
            password,
        );
    }

}
