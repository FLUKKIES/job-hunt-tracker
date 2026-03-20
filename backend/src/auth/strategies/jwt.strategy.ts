
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

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

    // มันจะเช็ค token เบื้องหลัง เช่น เช็ค exp ก่อนจะส่งให้ validate()
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
