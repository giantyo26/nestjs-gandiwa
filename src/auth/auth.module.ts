import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../typeorm/entities/users.entity';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [TypeOrmModule.forFeature([Users]), JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}

