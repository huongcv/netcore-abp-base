import paths from "@ord-core/config/paths";

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refresh-token';

const RETURN_ADMIN_TOKEN_KEY = 'auth-token-return';
const RETURN_ADMIN_REFRESHTOKEN_KEY = 'auth-refresh-token-return';

class JwtUtils {
    getToken() {
        return window.localStorage.getItem(TOKEN_KEY);
    }

    saveToken(token: string): void {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
    }

    saveRefreshToken(token: string): void {
        window.localStorage.removeItem(REFRESHTOKEN_KEY);
        window.localStorage.setItem(REFRESHTOKEN_KEY, token);
    }

    getRefreshToken() {
        return window.localStorage.getItem(REFRESHTOKEN_KEY);
    }

    public clear() {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(REFRESHTOKEN_KEY);
    }

    setTokenLoginWithOtherAccount(access_token: string, refresh_token: string) {
        // @ts-ignore
        window.localStorage.setItem(RETURN_ADMIN_TOKEN_KEY, this.getToken());
        // @ts-ignore
        window.localStorage.setItem(RETURN_ADMIN_REFRESHTOKEN_KEY, this.getRefreshToken());
        this.saveToken(access_token);
        this.saveRefreshToken(refresh_token);
    }

    returnAdmin() {
        const returnToken = window.localStorage.getItem(RETURN_ADMIN_TOKEN_KEY);
        if (returnToken) {
            this.saveToken(returnToken);
            // @ts-ignore
            this.saveRefreshToken(window.localStorage.getItem(RETURN_ADMIN_REFRESHTOKEN_KEY));
            window.localStorage.removeItem(RETURN_ADMIN_TOKEN_KEY);
            window.localStorage.removeItem(RETURN_ADMIN_REFRESHTOKEN_KEY);
            window.location.href = '';
        }
    }

    hasReturnAdmin(): boolean {
        const returnToken = window.localStorage.getItem(RETURN_ADMIN_TOKEN_KEY);
        return !!returnToken && returnToken.length > 0;
    }

    signOut(): void {
        window.localStorage.clear();
        sessionStorage.clear();
        window.location.href = paths.login;
    }
}

export default new JwtUtils();
