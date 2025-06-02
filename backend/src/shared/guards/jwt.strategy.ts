// backend/src/modules/v1/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

//Define the expected payload shape
export interface JwtPayload {
  id: number; //userId
  email: string;
}

@Injectable()
//the passport strategy is a part of @nestjs/passport
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'myDefaultSecret',
    });
  }

  validate(payload: JwtPayload) {
    // This function attaches the payload to req.user
    return { id: payload.id, email: payload.email };
  }
}
