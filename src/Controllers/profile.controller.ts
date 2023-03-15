import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/Guards/accessToken.guard';
import { Request } from 'express';
import { Roles } from 'src/Decorators/roles.decorator';
import { UserRole } from 'src/utils/enums';
import { RolesGuard } from 'src/Guards/userRoles.guard';
import { ProfileService } from 'src/Services/profileService';
import { UpdateUserEmailModel, UserUpdateModel } from 'src/Models/UserModels';

@ApiTags('Profile')
@Controller('/profile')
export class ProfileController {
    constructor(private profileService: ProfileService) { }

    @Get('/me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Details of current logged in user' })
    @UseGuards(AccessTokenGuard)
    async getUser(@Req() req: Request) {
        return this.profileService.getUser(req.user['sub']);
    }

    @Get('/all')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Details of all user' })
    @UseGuards(AccessTokenGuard, RolesGuard)
    async getAllUser(@Req() req: Request) {
        return this.profileService.getAllUsers(req.user['sub']);
    }

    @Patch('/update-details')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Details of current logged in user' })
    @UseGuards(AccessTokenGuard)
    async updateUserDetails(@Req() req: Request, @Body() userDetails: UserUpdateModel) {
        return this.profileService.updateUserDetails(req.user['sub'], userDetails);
    }

    @Patch('/:email/update-email')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update email of current logged in user' })
    @UseGuards(AccessTokenGuard)
    async updateUserEmail(@Req() req: Request, @Param('email') email: string) {
        return this.profileService.updateUserEmail(req.user['sub'], email);
    }

    @Post('/verify-new-email')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'confirm new email of current logged in user' })
    @UseGuards(AccessTokenGuard)
    async updateUser(@Req() req: Request, @Body() updateUserEmailModel: UpdateUserEmailModel) {
        return this.profileService.verifyEmailOTP(req.user['sub'], updateUserEmailModel);
    }

}
