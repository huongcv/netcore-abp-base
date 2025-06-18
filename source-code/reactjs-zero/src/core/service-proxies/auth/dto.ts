export interface LoginBody {
    TenantCode?: string | null;
    UserName?: string | null;
    Password?: string | null;
    ReturnURL?: string | null;
    FireBaseToken?: string | null;
    Platform?: string | null;
}

export interface JwtDto {
    accessToken: string;
    expireInSeconds?: number;
    refreshToken: string;
}
