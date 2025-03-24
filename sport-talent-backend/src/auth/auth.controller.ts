import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { Throttle } from '@nestjs/throttler';
import { v4 as uuidv4 } from 'uuid';
import { IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests per 60 seconds
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.userService.updateResetToken(email, token, expiry);
    await this.emailService.sendResetEmail(email, token);

    return { message: 'Reset link sent to your email' };
  }

  @Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests per 60 seconds
  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
    const { password } = resetPasswordDto;
    const user = await this.userService.findByResetToken(token);
    if (!user || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
    await this.userService.updatePassword(user.email, password);
    return { message: 'Password reset successfully' };
  }

  @Post('test-update-password') // Add this endpoint
  async testUpdatePassword(@Body('email') email: string, @Body('password') password: string) {
    await this.userService.updatePassword(email, password);
    return { message: 'Password updated successfully' };
  }
}