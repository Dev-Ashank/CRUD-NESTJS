import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { UpdateUserDto } from 'src/dto/UpdateUser.dto';
import { User } from 'src/entity/User';
import { FindOneOptions, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptionHandler/validationException';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
    async createUsers(createUserDto: CreateUserDto): Promise<User> {
        const { userName, email, password } = createUserDto;

        // Check if the email is already in use
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email address is already in use');
        }

        const newUser = new User();
        newUser.userName = userName;
        newUser.email = email;
        newUser.password = password;

        return this.userRepository.save(newUser);
    }

    async updateUsers(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
        const options: FindOneOptions<User> = {
            where: { id: userId },
        };

        const userToUpdate = await this.userRepository.findOne(options);

        if (!userToUpdate) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }


        // Check if the email is already in use by another user
        if (updateUserDto.email && updateUserDto.email !== userToUpdate.email) {
            const existingUser = await this.userRepository.findOne({ where: { email: updateUserDto.email } });
            if (existingUser) {
                throw new ConflictException('Email address is already in use');
            }
        }

        if (updateUserDto.userName) {
            userToUpdate.userName = updateUserDto.userName;
        }

        if (updateUserDto.email) {
            userToUpdate.email = updateUserDto.email;
        }
        if (updateUserDto.password) {
            userToUpdate.password = updateUserDto.password;
        }

        return this.userRepository.save(userToUpdate);
    }

    async deleteUsers(userId: number): Promise<{ user: User; message: string }> {

        const options: FindOneOptions<User> = {
            where: { id: userId },
        };

        const userToDelete = await this.userRepository.findOne(options);

        if (!userToDelete) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        await this.userRepository.remove(userToDelete);

        return { user: userToDelete, message: `User with ID ${userId} has been deleted successfully.` };

    }

    async findOneByIdAndUsername(id?: number, userName?: string): Promise<User | undefined> {
        const options: FindOneOptions<User> = {};

        if (id) {
            options.where = { ...options.where, id };
        }

        if (userName && userName.trim() !== '') {
            options.where = { ...options.where, userName: userName };
        }

        return await this.userRepository.findOne(options);
    }
}
