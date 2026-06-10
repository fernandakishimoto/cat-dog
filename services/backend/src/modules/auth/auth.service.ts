import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';

import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  private get supabase() {
    return createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.serviceRoleKey', { infer: true }),
      { realtime: { transport: WS as never } },
    );
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) {
      this.logger.error('Supabase signInWithPassword failed', error as any);
      throw new UnauthorizedException();
    }

    const userMetadataRole = data.user.user_metadata['role'];
    const appMetadataRole = data.user.app_metadata['role'];
    const resolvedRole = typeof userMetadataRole === 'string'
      ? userMetadataRole
      : typeof appMetadataRole === 'string'
        ? appMetadataRole
        : 'adotante';

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: resolvedRole.toLowerCase(),
      },
    };
  }

  async register(dto: RegisterDto): Promise<void> {
    const { error } = await this.supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          name: dto.name,
          role: 'adotante',
        },
      },
    });

    if (error) {
      // Log full error to help diagnose email sending or sign-up failures.
      this.logger.error('Supabase signUp failed', error as any);
      throw new UnauthorizedException();
    }
  }

}
