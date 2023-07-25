import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dto/UpdateUser.dto';
import { User } from 'src/users/entity/User';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) { }

    @Get()
    async getUsers(): Promise<User[]> {
        return this.usersService.getUsers();

    }
    @Get(':id?/:userName?')
    async findOneByIdAndUsername(@Param('id') id?: number, @Param('userName') userName?: string) {
        const user = await this.usersService.findOneByIdAndUsername(id, userName);
        return user ? { User: user } : { message: 'User not found' };
    }

    @Post()
    async createUsers(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.createUsers(createUserDto);
    }
    @Put(':id')
    async updateUsers(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        updateUserDto.id = Number(userId);
        return this.usersService.updateUsers(userId, updateUserDto);
    }

    @Delete(':id')
    async deleteUsers(@Param('id') userId: number): Promise<{ user: User; message: string }> {
        return await this.usersService.deleteUsers(userId);
    }
}
