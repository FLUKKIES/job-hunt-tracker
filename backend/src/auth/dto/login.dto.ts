import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {

    @IsNotEmpty({ message: "กรุณากรอก Username หรือ Email" })
    @IsString()
    readonly identifier: string;

    @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
    @IsString()
    @MinLength(8, { message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' })
    readonly password: string;
}