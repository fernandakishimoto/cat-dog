import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import type { Request } from 'express';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';
import { extractToken } from '@/common/utils/extract-token';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const supabase = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.anonKey', { infer: true }),
      { realtime: { transport: WS as never } },
    );

    let authUserResult: Awaited<ReturnType<typeof supabase.auth.getUser>>;
    try {
      authUserResult = await supabase.auth.getUser(token);
    } catch {
      throw new UnauthorizedException();
    }

    const { data, error } = authUserResult;

    if (error || !data.user) {
      throw new UnauthorizedException();
    }

    (request as Request & { user: unknown }).user = data.user;

    return true;
  }
}
