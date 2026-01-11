export declare function signAccessToken(payload: {
    id: string;
    username?: string;
}): any;
export declare function signRefreshToken(payload: {
    id: string;
}): any;
export declare function verifyAccessToken(token: string): any;
export declare function verifyRefreshToken(token: string): any;
//# sourceMappingURL=jwt.d.ts.map