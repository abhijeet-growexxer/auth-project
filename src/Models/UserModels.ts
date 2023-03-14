import { ApiProperty } from '@nestjs/swagger';
import { Date } from 'mongoose';

export class UserSignUpModel {
    @ApiProperty({
        example: 'test.dev_123',
        description: 'username',
    })
    username: string;

    @ApiProperty({
        example: 'Dev Test',
        description: 'full name of the user',
    })
    name: string;

    @ApiProperty({
        example: 'testdev789@yopmail.com',
        description: 'email address of the user',
    })
    email: string;

    @ApiProperty({
        example: '1234567890',
        description: 'phone number of the user',
    })
    phone: string;

    @ApiProperty({
        example: 'abcdef@123',
        description: 'new password of the user',
    })
    password: string;
}

export class UserSignInModel {
    @ApiProperty({
        example: 'test.dev_123',
        description: 'username',
    })
    username: string;

    @ApiProperty({
        example: 'testdev789@yopmail.com',
        description: 'Registered Email Address of the user',
    })
    email: string;

    @ApiProperty({
        example: 'abcdef@123',
        description: 'Password set by the user',
    })
    password: string;
}

export class UserUpdateModel {
    @ApiProperty({
        example: 'test.dev_123',
        description: 'username',
    })
    username: string;

    @ApiProperty({
        example: 'Test Dev',
        description: `User's full name`,
    })
    name: string;

    @ApiProperty({
        example: '1234567890',
        description: `User's phone number`,
    })
    phone: string;
}

export class UpdateUserEmailModel {
    @ApiProperty({
        example: 'testdev789@yopmail.com',
        description: 'email address of the user',
    })
    email: string;

    @ApiProperty({
        example: 'ae66e3',
        description: 'one time password for new email confirmation',
    })
    otp: string;

}