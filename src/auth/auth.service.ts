import { Injectable, ForbiddenException  } from '@nestjs/common'
import { EntityManager } from 'typeorm';
import { AuthDto } from './dto'
import { Users } from '../typeorm/entities/users.entity';
import { Profiles } from '../typeorm/entities/profiles.entity';

import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { JwtService } from "@nestjs/jwt";

dotenv.config()
@Injectable({})
export class AuthService {  
    constructor(private readonly entityManager: EntityManager, private jwtService: JwtService) {}
    async register(dto: AuthDto) {
        // generate password hash
        const hash = await bcrypt.hash(dto.password, 12)

        try {
            const user = new Users();
            user.username = dto.username
            user.email = dto.email;
            user.password = hash;

            const profile = new Profiles();
            profile.displayName = dto.username;
            user.profile = profile;

            // save new user & profiles to database
            await this.entityManager.save([user, profile]);        
        
            return { 
            msg: 'Registration successful', 
            data: user 
        }; 
        } catch (error) {
            // handle unique constraint violation error
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ForbiddenException('Registration failed: email already exists')
            }

            // handle other errors
            throw error;
        } 
            
    }

    async login(dto: AuthDto) {
        // find the user by email
        const user = await this.entityManager.findOne(Users, {
            where: { email: dto.email },
          });
      
        if (!user) {
            throw new ForbiddenException('Incorrect email');
        }

        // compare password
        const passwordMatches = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatches) {
            throw new ForbiddenException('Incorrect password');
        }   

        // generate and return access token
        const token = await this.signToken(user.id, user.email);

        return {
            msg: 'Login successful',
            data: user,
            token: token.access_token,
        };
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload =  {
            sub: userId,
            email
        }

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '45m',
            secret: process.env.JWT_SECRET
        })

        return {
            access_token: token
        }
    }
}