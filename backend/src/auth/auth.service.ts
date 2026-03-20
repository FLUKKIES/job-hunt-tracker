import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signin(dto: LoginDto) {
        const user = await this.usersService.findByEmailOrUsername(dto.identifier);
        if (!user) throw new UnauthorizedException('อีเมล/ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('อีเมล/ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง');

        const userId = user._id.toString();

        //gen tokens
        const tokens = await this.getTokens(userId, user.username)

        // เอา Refresh Token ไป Hash แล้วเซฟลง DB
        await this.updateRefreshToken(userId, tokens.refresh_token)

        return tokens;
    }

    async signup(dto: RegisterDto) {

        // Check email is existing?
        if (await this.usersService.findByEmail(dto.email)) {
            throw new ConflictException('Email already in use')
        } else if (await this.usersService.findByUsername(dto.username)) {
            throw new ConflictException('Username already in use')
        }

        // Hash Password
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(dto.password, salt);

        // Create User account
        return await this.usersService.create({ ...dto, password: passwordHashed });
    }

    async logout(userId: string) {
        await this.usersService.update(userId, { refreshToken: null });
    }


    // ฟังก์ชันตัวช่วย: สร้าง Token 2 ใบพร้อมกัน
    private async getTokens(userId: string, username: string) {
        /* 
            sub (Subject): รหัสระบุตัวตนหลัก (ID ของ User)
            iss (Issuer): ใครเป็นคนออก Token นี้ (เช่น ชื่อ Server หรือ Domain ของเรา)
            iat Issued at (seconds since Unix epoch)
            exp (Expiration Time): Token หมดอายุเมื่อไหร่
            aud (Audience): Token นี้สร้างมาให้ระบบไหนใช้
        */
        const payload = { sub: userId, username: username };

        const [accessToken, refreshToken] = await Promise.all([
            // ใบที่ 1: Access Token (อายุสั้น )
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("ACCESS_TOKEN_SECRET"), 
                expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRATION"),
            }),
            // ใบที่ 2: Refresh Token (อายุยาว )
            this.jwtService.signAsync(payload, {
                secret: this.configService.get("REFRESH_TOKEN_SECRET"), 
                expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRATION"),
            }),
        ]);

        return { access_token: accessToken, refresh_token: refreshToken };
    }

    // 2. ฟังก์ชันตัวช่วย: Hash Refresh Token แล้วเซฟลง Database
    private async updateRefreshToken(userId: string, refreshToken: string) {
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async refreshTokens(userId: string, incomingRefreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken) throw new ForbiddenException('ไม่อนุญาตให้เข้าถึง');

        const isRefreshTokenMatch = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
        if (!isRefreshTokenMatch) throw new ForbiddenException('ไม่อนุญาตให้เข้าถึง (refresh token not match)');

        const newTokens = await this.getTokens(userId, user.username);
        await this.updateRefreshToken(userId, newTokens.refresh_token);

        return newTokens
    }
}
