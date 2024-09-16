import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IncomingHttpHeaders } from 'http';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { IS_ADMIN_KEY } from 'src/decorators/admin.decorator';
import { IS_DEVELOPER_KEY } from 'src/decorators/developer.decorator'; // new import
import { UsersService } from 'src/api/users/users.service';

require('dotenv').config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = await this.usersService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException();
    }

    const isAdmin = this.reflector.get<boolean>(
      IS_ADMIN_KEY,
      context.getHandler(),
    );
    if (isAdmin && !request['user'].isAdmin) {
      throw new UnauthorizedException();
    }

    const isDeveloper = this.reflector.get<boolean>( // new check
      IS_DEVELOPER_KEY,
      context.getHandler(),
    );
    if (isDeveloper && !request['user'].isDeveloper) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: {
    headers: IncomingHttpHeaders;
  }): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
