import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'; // Import bcrypt

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByResetToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async updateResetToken(
    email: string,
    token: string,
    expiry: Date,
  ): Promise<void> {
    await this.userRepository.update(
      { email },
      { resetToken: token, resetTokenExpiry: expiry },
    );
  }

  async updatePassword(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    await this.userRepository.update(
      { email },
      { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    );
  }
}