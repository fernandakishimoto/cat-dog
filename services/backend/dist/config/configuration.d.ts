export declare const configuration: () => {
    port: number;
    supabase: {
        url: string;
        serviceRoleKey: string;
        anonKey: string;
    };
    frontend: {
        url: string;
    };
};
export type AppConfigType = ReturnType<typeof configuration>;
