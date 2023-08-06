import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { User } from 'src/users/entity/User';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users/users.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto): Promise<{ message: string; user: User }> {
        const user = await this.usersService.createUsers(signupDto);
        return { message: 'Signup successful', user };
    }

    async login(loginDto: LoginDto): Promise<{ message: string; accessToken?: string }> {
        const { email, password } = loginDto;

        try {
            // Step 1: Retrieve the user from the database based on the provided email
            const user = await this.usersService.findByEmail(email);


            // Step 2: Check if the user exists
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Step 3: Compare the provided password with the hashed password stored in the user object
            const isPasswordValid = await bcrypt.compare(password, user.password);


            // Step 4: Check if the password is valid
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Step 5: Create the payload for the JWT token
            const payload = { sub: user.id };

            try {

                // console.log('JWT Secret:', process.env.JWT_SECRET);
                // Step 6: Generate the JWT token asynchronously
                const access_token = this.jwtService.sign(payload);

                // Step 7: Token generation successful, log the token for debugging (optional)
                // console.log(access_token);

                // Step 8: Return the success response with the access token
                return {
                    message: 'Login successful',
                    accessToken: access_token
                };
            } catch (jwtError) {
                // Handle JWT-related errors during token generation
                // This might include issues with the secret/key, token format, or other JWT-specific errors.
                console.error('JWT Token Generation Error:', jwtError);
                throw new UnauthorizedException('Failed to generate access token');
            }
        } catch (loginError) {
            // Handle any errors that occur during the login process (e.g., database errors, service errors)
            console.error('Login Process Error:', loginError);
            throw new UnauthorizedException('Invalid credentials');
        }
    };
}
