import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

jest.mock('@nestjs/core');

describe('bootstrap', () => {
  const mockApp = {
    setGlobalPrefix: jest.fn(),
    enableCors: jest.fn(),
    enableShutdownHooks: jest.fn(),
    useGlobalPipes: jest.fn(),
    listen: jest.fn(),
  } as unknown as jest.Mocked<INestApplication>;

  beforeAll(() => {
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

   
  // disable the eslint because these are mock functions, so they don't rely on 'this' and so we KNOW the test context
  it('configures and starts the app', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.enableShutdownHooks).toHaveBeenCalled();
    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });
   
});
