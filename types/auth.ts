
export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    access_token?: string;
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
    token_type?: string;
    tokenType?: string;
}