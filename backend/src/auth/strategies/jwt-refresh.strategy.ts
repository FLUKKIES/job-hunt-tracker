import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.['refresh_token'] ?? null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("REFRESH_TOKEN_SECRET")!,
            // 💡 4. สั่งให้โยนค่า request ทะลุลงไปที่ฟังก์ชัน validate ด้วย
            passReqToCallback: true,

        })
    }

    validate(req: Request, payload: any) {
        const refreshToken = req?.cookies?.['refresh_token'];
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            userId: payload.sub,
            username: payload.username,
            refreshToken: refreshToken
        }
    }

}