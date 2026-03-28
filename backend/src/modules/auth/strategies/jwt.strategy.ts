import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  user_id: number;
  role_id: number;
  school_id: number;
  school_group_id: number;
}

// 🔐 SAFE COOKIE EXTRACTOR
const cookieExtractor = (req: Request): string | null => {
  if (!req || !req.cookies) return null;

  return (req.cookies as Record<string, string>)['authToken'] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('❌ JWT_SECRET not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      user_id: payload.user_id,
      role_id: payload.role_id,
      school_id: payload.school_id,
      school_group_id: payload.school_group_id,
    };
  }
}