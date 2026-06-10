"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = extractToken;
const normalizeToken = (token) => {
    const trimmedToken = token.trim().replace(/^"|"$/g, '');
    try {
        return decodeURIComponent(trimmedToken);
    }
    catch {
        return trimmedToken;
    }
};
function extractToken(request) {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        return normalizeToken(authHeader.slice(7));
    }
    const cookieToken = request.cookies?.['access_token'];
    if (!cookieToken) {
        return undefined;
    }
    return normalizeToken(cookieToken);
}
//# sourceMappingURL=extract-token.js.map