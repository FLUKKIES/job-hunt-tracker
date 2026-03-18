import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async signin(dto: LoginDto) {
        const { identifier, password } = dto;

        const user = await this.userService.findByEmailOrUsername(identifier);

        if (!user) throw new UnauthorizedException('อีเมล/ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('อีเมล/ชื่อผู้ใช้งาน หรือรหัสผ่านไม่ถูกต้อง');
        }

        /* 
            sub (Subject): รหัสระบุตัวตนหลัก (ID ของ User)
            iss (Issuer): ใครเป็นคนออก Token นี้ (เช่น ชื่อ Server หรือ Domain ของเรา)
            iat Issued at (seconds since Unix epoch)
            exp (Expiration Time): Token หมดอายุเมื่อไหร่
            aud (Audience): Token นี้สร้างมาให้ระบบไหนใช้
        */
        const payload = { sub: user.id, username: user.username }

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async signup(dto: RegisterDto) {

        // Check email is existing?
        if (await this.userService.findByEmail(dto.email)) {
            throw new ConflictException('Email already in use')
        } else if (await this.userService.findByUsername(dto.username)) {
            throw new ConflictException('Username already in use')
        }

        // Hash Password
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(dto.password, salt);

        // Create User account
        return await this.userService.create({ ...dto, password: passwordHashed });
    }
}
