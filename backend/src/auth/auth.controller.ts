import { Body, Controller, ForbiddenException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
        /* 
            หากไม่ระบุ passthrough เราจะต้องจัดการ Response เอง NestJS จะไม่จัดการให้ เราจะต้องสั่ง res.send() หรือ res.json() เอง
                * ถ้าไม่ใส่ passthrough แล้วไม่ res.send() เบราว์เซอร์จะหมุนติ้วๆ ค้างอยู่แบบนั้นตลอดกาลครับ
            หากระบุ passthrough เป็นการขอยืม res มาใช้ ไม่ได้อยากแย่งงานนายทำ เสร็จแล้วจะปล่อยผ่าน (Passthrough) หน้าที่จัดการบรรทัด return กลับไปให้นายทำแบบออโต้เหมือนเดิมนะ ช่วยแปลงเป็น JSON ให้ด้วย!
        */
        @Res({ passthrough: true }) res: Response
    ) {
        const tokens = await this.authService.signin(dto);
        this.setCookie(res, tokens)
        return { message: 'เข้าสู่ระบบสำเร็จ' };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const userId = req.user.userId;
        await this.authService.logout(userId);

        /*  res.clearCookie('ชื่อคุกกี้') 
            เบื้องหลังการทำงานของมันคือการสั่งเซ็ต maxAge ของคุกกี้ก้อนนั้นให้กลายเป็น 0 
            หรือเซ็ตวันหมดอายุให้เป็นอดีต เพื่อบังคับให้เบราว์เซอร์ลบทิ้งทันทีครับ 
        */
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return { message: "ออกจากระบบสำเร็จ" };
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
            sameSite: 'lax', // ป้องกันการโจมตีแบบ CSRF
            maxAge: 1000 * 60 * 15 // อายุของ Cookie (เช่น 1 วัน = 86,400,000 มิลลิวินาที)
        });

        // สั่งฝัง refresh_token ลงใน Cookie
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });
    }
}
