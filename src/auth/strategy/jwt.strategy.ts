import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EntityManager } from 'typeorm';
import { Injectable } from "@nestjs/common";
import * as dotenv from "dotenv"
import { Profiles } from "src/typeorm/entities/profiles.entity";

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy, 'jwt' ) {
    constructor( private readonly entityManager: EntityManager ) {
        super({
            jwtFromRequest:
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: {
        sub: number;
        email: string;
      }) {
        const profile = await this.entityManager.findOne(Profiles, {
          where: {
            id: payload.sub,
          },
        });
        return profile;
    }
}