
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.['access_token'] || null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("ACCESS_TOKEN_SECRET")!,
        });

    }

    // หลังจากผ่าน Guard มันจะเช็ค token อยู่เบื้องหลัง เช่น เช็ค exp ก่อนจะส่งให้ validate() ใน Guard
    async validate(payload: JwtPayload) {
        return { 
            userId: payload.sub, 
            username: payload.username,
            email: payload.email,
            role: payload.role 
        };
    }
}
