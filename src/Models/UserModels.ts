import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpModel {
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
        example: 'abcdef@123',
        description: 'new password of the user',
    })
    password: string;
}

export class UserSignInModel {
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
