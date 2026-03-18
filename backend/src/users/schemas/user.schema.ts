import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";
import { HydratedDocument } from "mongoose";

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

    @Prop({ default: true })
    isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);