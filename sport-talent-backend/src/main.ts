import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';


const PORT = process.env.PORT ?? 3000;

const httpsOptions = {
  key: fs.readFileSync('./src/secrets/private-key.pem'), // Path to your private key
  cert: fs.readFileSync('./src/secrets/public-certificate.pem'), // Path to your public certificate
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(PORT);
  Logger.log(process.env.POSTGRES_USER);
  Logger.log(`Server is now running on port ${PORT}`);
}
bootstrap();