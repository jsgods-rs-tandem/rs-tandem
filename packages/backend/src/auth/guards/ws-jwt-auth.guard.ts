import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { UserDto } from '@rs-tandem/shared';

interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

interface WsClient {
  handshake: {
    auth?: {
      token?: string;
    };
  };
  data: {
    user?: UserDto;
  };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: WsClient = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET not configured');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    client.data.user = user;

    return true;
  }
}
