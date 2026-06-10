"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const configuration = () => ({
    port: parseInt(process.env.PORT ?? '3001', 10),
    supabase: {
        url: process.env.SUPABASE_URL ?? '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        anonKey: process.env.SUPABASE_ANON_KEY ?? '',
    },
    frontend: {
        url: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    },
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map