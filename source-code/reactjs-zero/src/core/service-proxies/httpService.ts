import axios from 'axios';
import JwtUtils from "@ord-core/utils/jwt.utils";
import AuthApiService from "@ord-core/service-proxies/auth/authApiService";
import paths from "@ord-core/config/paths";
import {LangUtil} from "@ord-core/language/lang.utils";
import {AxiosBaseHttpApi} from "@ord-core/service-proxies/axios.base";
import CurrentShopUtil from "@ord-core/utils/currentShop.util";
import UiUtils from "@ord-core/utils/ui.utils";

let isRefreshing = false;
let refreshSubscribers: any[] = [];

const baseHttpApi = AxiosBaseHttpApi;

baseHttpApi.interceptors.request.use(
    function (config) {
        const token = window.localStorage.getItem('auth-token');
        if (!!token) {
            // @ts-ignore
            config.headers.common['Authorization'] = 'Bearer ' + token;
        }
        // @ts-ignore
        config.headers.common['Accept-Language'] = LangUtil.getLang();

        // const shopIdHeader = CurrentShopUtil.getShop();
        // if (shopIdHeader) {
        //     // @ts-ignore
        //     config.headers.common['x-shop-current'] = shopIdHeader;
        // }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

baseHttpApi.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const {config, response: {status}} = error;
        const originalRequest = config;
        // Kiểm tra mã lỗi có phải là 401 hoặc 403 hay không
        if (status === 401 && !!JwtUtils.getRefreshToken()) {
            if (!isRefreshing) {
                isRefreshing = true;
                AuthApiService.refreshToken().then((result) => {
                    if (result.isSuccessful) {
                        const newToken = result.data?.accessToken || ''
                        JwtUtils.saveToken(newToken);
                        JwtUtils.saveRefreshToken(result.data?.refreshToken || '');
                        isRefreshing = false;
                        onRrefreshed(newToken);
                    } else {
                        JwtUtils.saveToken("");
                        JwtUtils.saveRefreshToken('');
                        window.location.href = paths.login;
                    }
                });
            }
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh((token: string) => {
                    // replace the expired token and retry
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    resolve(axios(originalRequest));
                });
            });

        }

        if (status === 403) {
            const {config, response: {status, data}} = error;
            if (data?.error?.code) {
                UiUtils.showError('errorApi.' + data?.error?.code);
            }
        }

        // Nếu không, trả lỗi về điểm cuối đã gọi api
        return Promise.reject(error);
    }
);
const subscribeTokenRefresh = (cb: any) => {
    refreshSubscribers.push(cb);
}

const onRrefreshed = (token: any) => {
    refreshSubscribers.map(cb => cb(token));
}

export default baseHttpApi;
