import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ProfileModule } from './profile.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        AuthModule,
        ProfileModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.DATABASE_HOST)
    ]
})
export class AppModule { }
