import { Body, Controller, ForbiddenException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    signup(@Body() dto: RegisterDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    async signin(
        @Body() dto: LoginDto,
        // ใช้ passthrough: true เพื่อให้ NestJS ยังจัดการ Return รูปแบบ JSON ให้อัตโนมัติเหมือนเดิม
        @Res({ passthrough: true }) res: Response
    ) {
        const tokens = await this.authService.signin(dto);
        this.setCookie(res, tokens)
        return { message: 'เข้าสู่ระบบสำเร็จ' };
    }

    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const userId = req.user.userId;
        const refreshToken = req.user.refreshToken;
        const tokens = await this.authService.refreshTokens(userId, refreshToken);
        this.setCookie(res, tokens);
        return { message: 'ต่ออายุ Token สำเร็จ' };
    }


    private setCookie(res: Response, tokens: any) {
        // สั่งฝัง access_token ลงใน Cookie
        res.cookie('access_token', tokens.access_token, {
            httpOnly: true, // สำคัญมาก: ป้องกัน JavaScript ฝั่งหน้าเว็บเข้าถึง (กัน XSS)
            secure: process.env.NODE_ENV === 'production', // ให้เป็น true เฉพาะตอนรันบน HTTPS (Production)
            sameSite: 'strict', // ป้องกันการโจมตีแบบ CSRF
            maxAge: 1000 * 60 * 60 * 24 // อายุของ Cookie (เช่น 1 วัน = 86,400,000 มิลลิวินาที)
        });

        // สั่งฝัง refresh_token ลงใน Cookie
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
        });
    }
}
