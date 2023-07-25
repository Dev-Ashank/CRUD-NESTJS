import { IsOptional, IsString, IsEmail, Length, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    id: number;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    userName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6, 100)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d\s:]).{6,}$/, {
        message:
            'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    })
    password?: string;
}
