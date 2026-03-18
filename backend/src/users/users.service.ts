import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().lean().exec();
    }

    async findOne(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).lean().exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            email: email
        }).exec();
    }

    async findByUsername(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            username: username
        }).exec();
    }

    async findByEmailOrUsername(identifier: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier }
            ]
        }).exec();
    }

    async create(dto: RegisterDto): Promise<UserDocument | null> {
        return this.userModel.create(dto);
    }

}
