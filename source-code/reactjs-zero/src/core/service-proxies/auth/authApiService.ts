import {JwtDto, LoginBody} from "@ord-core/service-proxies/auth/dto";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import {AxiosBaseHttpApi} from "@ord-core/service-proxies/axios.base";

class AuthApiService {
    public async login(body: LoginBody) {
        let data = {
            userName: body.UserName,
            password: body.Password,
            tenantCode: body?.TenantCode,
            fireBaseToken: body.FireBaseToken,
            platform: body.Platform
        };

        const httpApi = AxiosBaseHttpApi;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'api/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        };

        const result = await httpApi.request(config);
        console.log(result);
        return result.data;

    }

    public async refreshToken() {
        const httpApi = AxiosBaseHttpApi;
        let config = {
            method: 'post',
            url: 'api/auth/refresh-token-cookie'
        };
        const result = await httpApi.request(config);
        return result.data as CommonResultDto<JwtDto>;
    }

    public async logout() {
        const httpApi = AxiosBaseHttpApi;
        let config = {
            method: 'post',
            url: 'api/auth/logout'
        };
        const result = await httpApi.request(config);
        return result.data as CommonResultDto<JwtDto>;
    }
}

export default new AuthApiService();
