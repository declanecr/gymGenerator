import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors(); // Enable CORS for frontend

  /* in NestJS a PIPE is a class used to 
    +Transform input data, 
    +Validate data, and 
    +Throw errors if validation failed
     WHITELIST causes NestJS to automatically strip out any properties that aren't defined in the DTO
  */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Enable validation for DTOs (Data Transfer Objects)
  await app.listen(3000);
}
void bootstrap();

/* 
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
}); 
//use this if i want to catch unexpected startup issues
*/
