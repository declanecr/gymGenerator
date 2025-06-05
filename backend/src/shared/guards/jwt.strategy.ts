// backend/src/modules/v1/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

//Define the expected payload shape
export interface JwtPayload {
  id: number; //userId
  email: string;
}

@Injectable()
//the passport strategy is a part of @nestjs/passport
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'myDefaultSecret',
    });
  }

  async validate(payload: JwtPayload) {
    //load the entire user (including role) from DB
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, role: true },
    });
    if (!user) throw new UnauthorizedException('Invalid token: user not found');
    return user; // now req.user has {id, email, role}
  }
}
