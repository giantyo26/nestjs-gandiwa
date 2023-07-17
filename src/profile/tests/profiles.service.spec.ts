import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { ProfileService } from '../profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profiles } from '../../typeorm/entities/profiles.entity';

describe('ProfileService', () => {
  let service: ProfileService;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('updateProfile', () => {
    const userId = 1;
    const dto: UpdateProfileDto = {
      displayName: 'Test User',
      age: 25,
      bio: 'Lorem ipsum',
    };
    const profile: Profiles = {
      id: userId,
      displayName: 'Old Name',
      age: 30,
      bio: 'Old Bio',
    };

    it('should find and update the profile with the given user ID', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(profile);
      const saveSpy = jest.spyOn(entityManager, 'save').mockResolvedValueOnce(profile);

      const updatedProfile = await service.updateProfile(userId, dto);

      expect(entityManager.findOne).toHaveBeenCalledWith(Profiles, {
        where: { id: userId },
      });
      expect(saveSpy).toHaveBeenCalledWith(profile);
      expect(updatedProfile).toEqual(profile);
      expect(updatedProfile.displayName).toEqual(dto.displayName);
      expect(updatedProfile.age).toEqual(dto.age);
      expect(updatedProfile.bio).toEqual(dto.bio);
    });

    it('should throw an error if the profile with the given user ID is not found', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.updateProfile(userId, dto)).rejects.toThrow(
        `User with id ${userId} not found`,
      );
    });
  });
});
