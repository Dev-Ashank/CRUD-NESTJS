import { IsString, IsEmail, Length, Matches, IsNotEmpty, IsLowercase } from 'class-validator';

export class SignupDto {
    @IsString({ message: 'Username must be a string' })
    @Length(3, 50, { message: 'Username must be between 3 and 50 characters long' })
    userName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsLowercase({ message: 'Email must be in lowercase' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @Length(6, 100, { message: 'Password must be between 6 and 100 characters long' })
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d\s:]).{6,}$/, {
        message:
            'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    })
    password: string;
}
