import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./contrants";

@Module({
    imports: [UserModule, JwtModule.register({
        global: true, // we don't need to import the JwtModule anywhere else
        secret: jwtConstants.secret,
        signOptions: {
            expiresIn: '1d'
        }
    })],
    providers: [AuthService],
    controllers: [AuthController],
})

export class AuthModule { }