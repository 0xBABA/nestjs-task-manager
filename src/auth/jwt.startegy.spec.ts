import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JWT startegy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('return user if user found from jwt payload data', async () => {
      const user = new User();
      user.username = 'TestUser';
      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: 'TestUser',
      });
      expect(result).toEqual(user);
    });

    it('Throws UnauthorizedException if user is not found', async () => {
      userRepository.findOne.mockRejectedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
