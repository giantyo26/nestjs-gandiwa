import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UpdateProfileDto } from './dto';
import { Profiles } from 'src/typeorm/entities/profiles.entity';

@Injectable()
export class ProfileService {
  constructor(private readonly entityManager: EntityManager) {}

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ) {
    const profile = await this.entityManager.findOne(Profiles, {
        where: { id: userId },
    });

    if (!profile) {
      throw new Error(`User with id ${userId} not found`);
    }

    profile.displayName = dto.displayName;
    profile.age = dto.age;
    profile.bio = dto.bio;

    const updatedProfile = await this.entityManager.save(profile);


    return updatedProfile;
  }
}
