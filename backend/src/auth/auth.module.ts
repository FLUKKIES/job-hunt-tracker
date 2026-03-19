import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./contrants";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true, // we don't need to import the JwtModule anywhere else
            secret: jwtConstants.secret,
            signOptions: {
                expiresIn: '30s'
            }
        }),
        PassportModule
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule { }