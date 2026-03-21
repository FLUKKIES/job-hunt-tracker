import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles([ Role.USER ])
    @Get()
    async getAll() {
        return await this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findOne(
        @Param('id') id: string,
    ) {
        return this.userService.findById(id);
    }

}
