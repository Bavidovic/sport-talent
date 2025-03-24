// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface'; // Ensure this interface exists

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email: user.email, sub: user.id }; // Use the custom interface
      const accessToken: string = await this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  // Example method using JwtService
  async generateToken(user: User): Promise<string> {
    const payload: JwtPayload = { email: user.email, sub: user.id }; // Use the custom interface
    return this.jwtService.sign(payload);
  }
}