import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.salt = 'testSalt';
    user.password = 'testPassword';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockResolvedValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('1234');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      bcrypt.hash.mockResolvedValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('1234');
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
