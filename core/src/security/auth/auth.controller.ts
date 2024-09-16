import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiProperty, ApiResponse, ApiTags} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {Public} from "../../decorators/public.decorator";
import {LoginDto} from "../dto/login.dto";
import {RegisterDto} from "../dto/register.dto";

@ApiTags('Auth Management')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiProperty({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiResponse({ status: 200, description: 'Register successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiProperty({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Get('verify/:token')
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiProperty({ type: String })
  async verifyEmail(@Param('token') token: string) {
    const user = await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully', user };
  }

  @Public()
  @Post('resend-email')
  @ApiResponse({ status: 200, description: 'Email resent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiProperty({ type: String })
  async resendEmail(@Param('email') @Body('email') email: string) {
    return this.authService.resendVerification(email);
  }
}

