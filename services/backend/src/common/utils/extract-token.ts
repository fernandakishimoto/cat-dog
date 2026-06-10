import type { Request } from 'express';

const normalizeToken = (token: string): string => {
  const trimmedToken = token.trim().replace(/^"|"$/g, '');

  try {
    return decodeURIComponent(trimmedToken);
  } catch {
    return trimmedToken;
  }
};

export function extractToken(request: Request): string | undefined {
  const authHeader = request.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    return normalizeToken(authHeader.slice(7));
  }

  const cookieToken = request.cookies?.['access_token'] as string | undefined;

  if (!cookieToken) {
    return undefined;
  }

  return normalizeToken(cookieToken);
}
