import type { Request } from 'express';

export function extractToken(request: Request): string | undefined {
  const authHeader = request.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return request.cookies?.['access_token'] as string | undefined;
}
