import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenExpiredError } from '@nestjs/jwt';
import { UsersService } from '../../api/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private _configService: ConfigService,
    private _usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      return { id: payload.sub, username: payload.username };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // If the error is TokenExpiredError, handle it silently
      } else {
        // For all other errors, log them
        this.logger.error(`JWT validation failed: ${error.message}`);
      }
      throw error;
    }
  }
}
