import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './contollers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';

dotenv.config();

@Module({
    imports: [UsersModule, // Register the UsersModule
        JwtModule.register({
            global: true,
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController], // Declare the controllers used in this module
    providers: [AuthService, {
        provide: APP_GUARD,
        useClass: AuthGuard,
    }],
    exports: [AuthService],//Exports AuthService 
})
export class AuthModule {
}
