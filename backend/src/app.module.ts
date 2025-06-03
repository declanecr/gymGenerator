import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { ExercisesCatalogModule } from './modules/v1/exercises-catalog/exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    ExercisesCatalogModule,
    // Add other modules here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
