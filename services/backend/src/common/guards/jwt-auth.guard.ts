import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import type { Request } from 'express';

import type { AppConfigType } from '@/config/configuration';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const supabase = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.anonKey', { infer: true }),
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException();
    }

    (request as Request & { user: unknown }).user = data.user;

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return request.cookies?.['access_token'];
  }

}
