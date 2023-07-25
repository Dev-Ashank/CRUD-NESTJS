import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './contollers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
    imports: [UsersModule, // Register the UsersModule
        JwtModule.register({
            global: true,
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController], // Declare the controllers used in this module
    providers: [AuthService], // Declare the services used in this module
    exports: [AuthService],//Exports AuthService 
})
export class AuthModule {
}
