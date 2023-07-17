import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './typeorm/entities/users.entity';
import { Profiles } from './typeorm/entities/profiles.entity';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import * as dotenv from 'dotenv';

// Load up env file
dotenv.config()

@Module({
  imports: [AuthModule, ProfileModule,  TypeOrmModule.forRoot({
    type: 'mysql',
    url: process.env.DATABASE_URL,
    entities: [Users, Profiles],
    synchronize: true,
  })],
})
export class AppModule {}
