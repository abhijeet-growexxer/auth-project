import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: 2 })
    role: number;

    @Prop({ default: null })
    refreshToken: string;

    @Prop({ default: null })
    verificationOTP: number;

    @Prop({ default: false })
    verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
