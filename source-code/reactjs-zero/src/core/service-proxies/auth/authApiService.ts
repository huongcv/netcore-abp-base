import {JwtDto, LoginBody} from "@ord-core/service-proxies/auth/dto";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import JwtUtils from "@ord-core/utils/jwt.utils";
import qs from 'qs';
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
            url: 'api/auth/auth/login',
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
        let data = qs.stringify({
            AccessToken: JwtUtils.getToken(),
            RefreshToken: JwtUtils.getRefreshToken(),
        });
        const httpApi = AxiosBaseHttpApi;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'api/auth-plugin/auth/refresh-token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };
        console.log("httpApi", httpApi)
        const result = await httpApi.request(config);
        return result.data as CommonResultDto<JwtDto>;
    }
}

export default new AuthApiService();
