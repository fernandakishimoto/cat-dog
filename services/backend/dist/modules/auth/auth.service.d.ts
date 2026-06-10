import { ConfigService } from '@nestjs/config';
import type { AppConfigType } from '@/config/configuration';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService<AppConfigType, true>);
    private get supabase();
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | undefined;
            role: string;
        };
    }>;
    register(dto: RegisterDto): Promise<void>;
}
