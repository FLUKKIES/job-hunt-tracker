import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum Role {
    USER = 'USER',     // ผู้ใช้งานทั่วไป (ผู้ซื้อ/ผู้ขาย)
    ADMIN = 'ADMIN',   // ผู้ดูแลระบบ
}

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string

    @Prop({ require: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    firstName: string

    @Prop({ required: true })
    lastName: string

    @Prop({ type: String, enum: Role, default: Role.USER})
    role: Role;

    @Prop({ default: true })
    isActive: boolean

    @Prop({ required: false })
    refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User);