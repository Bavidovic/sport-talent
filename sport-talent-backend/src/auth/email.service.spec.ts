import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

// Mock the entire nodemailer module
jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Set up the sendMail mock
    sendMailMock = jest.fn().mockResolvedValue(true);

    // Mock the createTransport function to return an object with sendMail
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    // Create the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    // Get the EmailService instance
    service = module.get<EmailService>(EmailService);
  });

  it('should send reset email', async () => {
    // Call the method under test
    await service.sendResetEmail('user@example.com', 'valid-token');

    // Assert that sendMail was called with the correct arguments
    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: 'user@example.com',
      subject: 'Password Reset',
      text: 'Click the link to reset your password: http://localhost:4200/reset-password?token=valid-token', // Updated URL
    });
  });
});