import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let userService: UserService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            findByResetToken: jest.fn(),
            updateResetToken: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should return success message for valid email', async () => {
      const email = 'user@example.com';
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        password: 'hashedPassword',
        account_type: 'user',
        resetToken: null,
        resetTokenExpiry: null,
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'updateResetToken').mockResolvedValue(undefined);
      jest.spyOn(emailService, 'sendResetEmail').mockResolvedValue(undefined);

      const result = await controller.forgotPassword(email);
      expect(result).toEqual({ message: 'Reset link sent to your email' });
    });

    it('should throw NotFoundException for non-existent email', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(controller.forgotPassword(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password for valid token', async () => {
      const token = 'valid-token';
      const password = 'NewPassword123!';
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        password: 'hashedPassword',
        account_type: 'user',
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // Valid expiry
      };

      jest.spyOn(userService, 'findByResetToken').mockResolvedValue(user);
      jest.spyOn(userService, 'updatePassword').mockResolvedValue(undefined);

      const result = await controller.resetPassword(token, { password });
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid-token';
      const password = 'NewPassword123!';
      jest.spyOn(userService, 'findByResetToken').mockResolvedValue(null);

      await expect(controller.resetPassword(token, { password })).rejects.toThrow(BadRequestException);
    });

    it('should throw error for expired token', async () => {
      const token = 'expired-token';
      const password = 'NewPassword123!';
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com',
        password: 'hashedPassword',
        account_type: 'user',
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() - 15 * 60 * 1000), // Expired expiry
      };

      jest.spyOn(userService, 'findByResetToken').mockResolvedValue(user);

      await expect(controller.resetPassword(token, { password })).rejects.toThrow(BadRequestException);
    });
  });
});