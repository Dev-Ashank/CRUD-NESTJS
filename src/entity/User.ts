import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsString, IsEmail, Length, Matches, validate, IsLowercase } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'src/exceptionHandler/validationException';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @IsString()
    @Length(3, 50)
    userName: string;

    @Column({ unique: true, nullable: false })
    @IsEmail()
    @IsLowercase()
    email: string;

    @Column({ nullable: false })
    @IsString()
    @Length(6, 100)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d\s:]).{6,}$/, {
        message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    })
    password: string;

    @BeforeInsert()
    @BeforeUpdate()
    async validateEntity() {
        const validationErrors = await validate(this);
        if (validationErrors.length > 0) {
            const errorMessages = validationErrors.map((error) => Object.values(error.constraints)).flat();
            throw new ValidationException(errorMessages);
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
