import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfigType } from '@/config/configuration';
export declare class JwtAuthGuard implements CanActivate {
    private readonly configService;
    constructor(configService: ConfigService<AppConfigType, true>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
