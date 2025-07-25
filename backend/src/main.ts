import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//console.log('Starting backend via main.ts...');

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.enableCors(); // Enable CORS for frontend
  app.enableShutdownHooks();

  /* in NestJS a PIPE is a class used to 
    +Transform input data, 
    +Validate data, and 
    +Throw errors if validation failed
     WHITELIST causes NestJS to automatically strip out any properties that aren't defined in the DTO
  */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  ); // Enable validation for DTOs (Data Transfer Objects)
  await app.listen(3000);
}
if (require.main === module) {
  void bootstrap();
}
/* 
bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
}); 
//use this if i want to catch unexpected startup issues
*/
