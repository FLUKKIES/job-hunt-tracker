import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterDto {

    @IsEmail()
    @IsNotEmpty({ message: 'กรุณากรอก Email'})
    readonly email

    @IsNotEmpty({ message: 'กรุณากรอก Username'})
    @IsString()
    readonly username

    @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่าน' })
    @IsString()
    @MinLength(8, { message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' })
    readonly password

    @IsString()
    readonly firstName

    @IsString()
    readonly lastName

}