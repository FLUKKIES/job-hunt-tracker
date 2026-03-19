
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../contrants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    // มันจะเช็ค token เบื้องหลัง เช่น เช็ค exp ก่อนจะส่งให้ validate()
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
