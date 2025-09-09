import { Controller, Get, Param, Put, Delete, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Post, Body } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard,RolesGuard)
export class UsersController {
    constructor(private readonly service: UsersService) {}

 
    @Post()
    @Roles(Role.ADMIN, Role.SUPERVISOR)
    async create(@Body() dto: CreateUserDto, @Req() req) {
      return this.service.create(dto, req.user.roles);
    }

    @Get()
    @Roles(Role.ADMIN)
    async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
        return this.service.findAll(+skip, +take);
      }
    
    @Get(':id')
    @Roles(Role.ADMIN,Role.SUPERVISOR)
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
        return this.service.update(id, dto, req.user.roles);
    }
    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }

}
