import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;

    @Prop({ require: true })
    username: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    avatar: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true, default: 2 })
    role: number;

    @Prop({ default: null })
    refreshToken: string;

    @Prop({ default: null })
    verificationOTP: string;

    @Prop({ default: false })
    verified: boolean;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: new Date(Date.now()) })
    createdAt: Date;

    @Prop({ default: new Date(Date.now()) })
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
