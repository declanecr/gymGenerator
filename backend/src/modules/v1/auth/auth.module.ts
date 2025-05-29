import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../../shared/guards/jwt.strategy';

// This tells Nest how to issue JWTs for the login route
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'myDefaultSecret', // use env var in prod!
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], //these are just services, just different name for them
  controllers: [AuthController],
  exports: [AuthService], // So other modules (like guards) can use AuthService/JwtModule if needed
})
export class AuthModule {}
