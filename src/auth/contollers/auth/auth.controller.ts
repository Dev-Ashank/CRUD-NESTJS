import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Req,
} from '@nestjs/common';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { User } from 'src/users/entity/User';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Public } from 'src/custom.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
  ): Promise<{ message: string; user: User }> {
    const { message, user } = await this.authService.signup(signupDto);
    return { message, user };
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; accessToken?: string }> {
    try {
      // Call the login method of the AuthService to perform authentication
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Public()
  @Get('verify-token')
  async verifyToken(@Req() req) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
      // Use the AuthService to verify the token
      const isTokenValid = this.authService.verifyToken(token);

      // Return true if the token is valid
      return isTokenValid;
    } catch (error) {
      // Return an UnauthorizedException if the token is invalid
      throw new UnauthorizedException(error.message);
    }
  }
}
