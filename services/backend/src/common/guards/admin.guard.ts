import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import type { Request } from 'express';

import type { AppConfigType } from '@/config/configuration';
import { extractToken } from '@/common/utils/extract-token';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractToken(request);

    if (!token) {
      throw new ForbiddenException();
    }

    const supabase = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.anonKey', { infer: true }),
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new ForbiddenException();
    }

    const role = data.user.user_metadata['role'] as string | undefined;

    if (role !== 'admin') {
      throw new ForbiddenException();
    }

    (request as Request & { user: unknown }).user = data.user;

    return true;
  }

}
