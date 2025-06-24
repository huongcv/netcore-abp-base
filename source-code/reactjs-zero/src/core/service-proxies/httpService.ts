import axios from 'axios';
import JwtUtils from "@ord-core/utils/jwt.utils";
import AuthApiService from "@ord-core/service-proxies/auth/authApiService";
import {LangUtil} from "@ord-core/language/lang.utils";
import {AxiosBaseHttpApi} from "@ord-core/service-proxies/axios.base";
import UiUtils from "@ord-core/utils/ui.utils";

let isRefreshing = false;
let refreshSubscribers: any[] = [];

const baseHttpApi = AxiosBaseHttpApi;

baseHttpApi.interceptors.request.use(
    function (config) {
        // @ts-ignore
        config.headers.common['Accept-Language'] = LangUtil.getLang();
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

baseHttpApi.interceptors.response.use(
    response => {
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            sessionStorage.setItem('content-disposition', contentDisposition);
        }
        return response;
    },
    error => {
        const {config, response: {status}} = error;
        const originalRequest = config;
        // Kiểm tra mã lỗi có phải là 401 hay không
        if (status === 401) {
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
                        JwtUtils.signOut();
                    }
                });
            }
            return new Promise((resolve, reject) => {
                subscribeTokenRefresh((token: string) => {
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
