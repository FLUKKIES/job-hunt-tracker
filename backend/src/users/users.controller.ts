import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @Get()
    async getAll() {
        return await this.userService.findAll();
    }

    @Get(":id")
    findOne(
        @Param('id') id: string,
    ) {
        return this.userService.findOne(id);
    }

}
