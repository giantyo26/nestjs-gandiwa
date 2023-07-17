import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { EntityManager } from 'typeorm';
import { AuthDto } from '../dto'
import { JwtService } from '@nestjs/jwt';
import { ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let entityManager: EntityManager;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, EntityManager, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    entityManager = module.get<EntityManager>(EntityManager);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    const dto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    const user = {
      id: 1,
      username: dto.username,
      email: dto.email,
      password: expect.any(String),
    };
    const profile = {
      id: 1,
      displayName: dto.username,
    };

    const saveMock = jest.fn().mockResolvedValueOnce([user, profile]);
    entityManager.save = saveMock;

    const result = await authService.register(dto);

    expect(saveMock).toHaveBeenCalledWith([user, profile]);
    expect(result).toEqual({
      msg: 'Registration successful',
      data: user,
    });
  });

  it('should throw ForbiddenException when email already exists', async () => {
    const dto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    const saveMock = jest.fn().mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' });
    entityManager.save = saveMock;

    await expect(authService.register(dto)).rejects.toThrow(ForbiddenException);
    expect(saveMock).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should propagate other errors during registration', async () => {
    const dto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    const saveMock = jest.fn().mockRejectedValueOnce(new Error('Oops'));
    entityManager.save = saveMock;

    await expect(authService.register(dto)).rejects.toThrow(Error);
    expect(saveMock).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should login with correct email and password', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
    };
    const user = {
      id: 1,
      email: dto.email,
      password: expect.any(String),
    };
    const token = { access_token: 'token' };

    const findOneMock = jest.fn().mockResolvedValueOnce(user);
    const compareMock = jest.fn().mockResolvedValueOnce(true);
    const signTokenMock = jest.fn().mockResolvedValueOnce(token);
    entityManager.findOne = findOneMock;
    authService.signToken = signTokenMock;

    const result = await authService.login(new AuthDto);

    expect(findOneMock).toHaveBeenCalledWith(expect.anything(), {
      where: { email: dto.email },
    });
    expect(compareMock).toHaveBeenCalledWith(dto.password, user.password);
    expect(signTokenMock).toHaveBeenCalledWith(user.id, user.email);
    expect(result).toEqual({
      msg: 'Login successful',
      data: user,
      token: token.access_token,
    });
  });

  it('should throw ForbiddenException when email is incorrect during login', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password',
    };
    const findOneMock = jest.fn().mockResolvedValueOnce(undefined);
    entityManager.findOne = findOneMock;

    await expect(authService.login(new AuthDto)).rejects.toThrow(ForbiddenException);
    expect(findOneMock).toHaveBeenCalledWith(expect.anything(), {
      where: { email: dto.email },
    });
  });

  it('should throw ForbiddenException when password is incorrect during login', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };
    const user = {
      id: 1,
      email: dto.email,
      password: expect.any(String),
    };

    const findOneMock = jest.fn().mockResolvedValueOnce(user);
    const compareMock = jest.fn().mockResolvedValueOnce(false);
    entityManager.findOne = findOneMock;

    await expect(authService.login(new AuthDto)).rejects.toThrow(ForbiddenException);
    expect(findOneMock).toHaveBeenCalledWith(expect.anything(), {
      where: { email: dto.email },
    });
    expect(compareMock).toHaveBeenCalledWith(dto.password, user.password);
  });

  it('should sign access token with correct payload', async () => {
    const userId: number = 1;
    const email: string = 'test@example.com';
    const token = { access_token: 'token' };

    const jwtSignMock = jest.fn().mockResolvedValueOnce(token.access_token);
    jwtService.sign = jwtSignMock;

    const result = await authService.signToken(userId, email);

    expect(jwtSignMock).toHaveBeenCalledWith({ sub: userId, email }, { expiresIn: '45m', secret: process.env.JWT_SECRET });
    expect(result).toEqual(token);
  });

});