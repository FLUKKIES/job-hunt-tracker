import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env.dev",
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI!),

    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
