import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should call AuthService.register with the correct arguments', async () => {
      const registerSpy = jest.spyOn(authService, 'register');

      const dto: AuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      await controller.register(dto);

      expect(registerSpy).toHaveBeenCalledWith(dto);
    });

    it('should return the result of AuthService.register', async () => {
      const result = {
        msg: 'Registration successful',
        data: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
      };

      const dto: AuthDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      };

      const response = await controller.register(dto);

      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with the correct arguments', async () => {
      const loginSpy = jest.spyOn(authService, 'login');

      const dto: AuthDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };

      await controller.login(dto);

      expect(loginSpy).toHaveBeenCalledWith(dto);
    });

    it('should return the result of AuthService.login', async () => {
      const result = {
        msg: 'Login successful',
        data: {
          id: 1,
          email: 'test@example.com',
        },
        token: 'access_token',
      };

      const dto: AuthDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };

      const response = await controller.login(dto);

      expect(response).toEqual(result);
    });
  });
});
