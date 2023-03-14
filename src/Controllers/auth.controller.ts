import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../Services/authService';
import { UserSignUpModel, UserSignInModel } from '../Models/UserModels';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/Guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/Guards/refreshToken.guard';
import { Request } from 'express';

@ApiTags('Authentication')
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
    @ApiOperation({ summary: 'User login with username/email and password' })
    @ApiResponse({ status: 200, description: 'Login Successful' })
    async signIn(@Body() userDetails: UserSignInModel) {
        return this.authService.signIn(userDetails);
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
        @Query('otp') otp: string
    ) {
        return this.authService.verifyOTP(req.user['sub'], otp);
    }

    @Post('/forgot-password/:email')
    @ApiOperation({ summary: 'For reseting the password of the user' })
    async forgotPassword(
        @Param('email') email: string,
    ) {
        return this.authService.forgotPassword(email);
    }

    @Post('/reset-confirm-otp/:email/:otp')
    @ApiOperation({ summary: 'Confirm otp for reseting the password' })
    async confirmOTP(
        @Param('email') email: string,
        @Param('otp') otp: string
    ) {
        return this.authService.confirmOTP(email, otp);
    }

    @Patch('/update-password/:password')
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Set a new password' })
    async updatePassword(
        @Req() req: Request,
        @Param('password') password: string
    ) {
        return this.authService.updatePassword(
            req.user['sub'],
            password,
        );
    }

}
