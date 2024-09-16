import { Injectable } from '@nestjs/common';
import { UsersService } from "../../modules/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../../providers/email/email.service";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // VALIDATE USER
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
  }

  // LOGIN USER
  async login(login: LoginDto) {
    const user = await this.validateUser(login.email, login.password);
    if (!user) {
      return { message: 'Invalid email or password' };
    }

    if (!user.isVerified) {
      return { message: 'Please verify your email before logging in' };
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // Add other user fields as needed
      },
    };
  }

  // REGISTER USER
  async register(registerDto: RegisterDto) {
    if (await this.usersService.findByEmail(registerDto.email)) {
      return { message: 'User already exists' };
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // Assign the 'Member' role to the user
    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      isVerified: false,
      isAdmin: false,
    });

    await this.emailService.sendVerificationEmail(user); // Send the verification email

    const { password, ...result } = user;
    return result;
  }

  // VERIFY EMAIL
  async verifyEmail(token: string) {
    // Find the user associated with the verification token
    const user = await this.usersService.findByVerificationToken(token);

    if (!user || user.verifyToken !== token) {
      throw new Error('Invalid verification token');
    }

    // Set the user's isVerified property to true, remove the verification token and save the user
    user.isVerified = true;
    user.verifyToken = null;
    user.isReserved = false;
    await this.usersService.usersRepository.save(user);
    return user;
  }

  // RESEND VERIFICATION EMAIL
  async resendVerification(email: string) {
    {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return { message: 'User not found' };
      }
      if (!user.verifyToken) {
        return { message: 'User is already verified' };
      }
      await this.emailService.sendVerificationEmail(user);
      return { message: 'Verification email sent successfully' };
    }
  }
}
