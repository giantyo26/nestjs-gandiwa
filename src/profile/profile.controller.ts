import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Users } from '../typeorm/entities/users.entity';
import { GetUser } from '../auth/custom-decorator';
import { UpdateProfileDto } from './dto';
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/auth/guard';

// Protected route
@UseGuards(JwtGuard)
@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
      ) {}
    
    @Get('me') 
    async getMe(@GetUser() user: Users) {
        return user;
    }
    
    @Patch()
    async updateUser(  
        @GetUser('id') userId: number,
        @Body() dto: UpdateProfileDto,)
        {
            return this.profileService.updateProfile(userId, dto);
        }
}