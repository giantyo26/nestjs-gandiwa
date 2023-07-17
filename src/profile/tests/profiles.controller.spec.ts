import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        ProfileService,
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('updateUser', () => {
    const userId = 1;
    const dto: UpdateProfileDto = {
      displayName: 'Test User',
      age: 25,
      bio: 'Lorem ipsum',
    };

    it('should call ProfileService.updateProfile with the correct arguments', async () => {
      const updateProfileSpy = jest.spyOn(profileService, 'updateProfile');

      await controller.updateUser(userId, dto);

      expect(updateProfileSpy).toHaveBeenCalledWith(userId, dto);
    });

    it('should return the result of ProfileService.updateProfile', async () => {
      const result = {
        id: userId,
        displayName: dto.displayName,
        age: dto.age,
        bio: dto.bio,
      };
      jest.spyOn(profileService, 'updateProfile').mockResolvedValueOnce(result);

      const response = await controller.updateUser(userId, dto);

      expect(response).toEqual(result);
    });
  })
});