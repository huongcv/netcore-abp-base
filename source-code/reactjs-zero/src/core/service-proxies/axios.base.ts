import axios, {AxiosRequestTransformer} from "axios";
import qs from "qs";
import {format} from "date-fns";

const isPlainObject = (v: unknown) =>
    Object.prototype.toString.call(v) === '[object Object]';
const dateTransformer: AxiosRequestTransformer = (data: any) => {
    if (data instanceof Date) {
        // do your specific formatting here
        const formattedDate = format(data, "yyyy-MM-dd'T'HH:mm:ss");
        return formattedDate;
    }
    if (Array.isArray(data)) {
        // @ts-ignore
        return data.map((val) => dateTransformer(val));
    }
    if (isPlainObject(data)) {

        return Object.fromEntries(
            // @ts-ignore
            Object.entries(data).map(([key, val]) => [key, dateTransformer(val)]),
        );
    }
    return data;
};
export const AxiosBaseHttpApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT?? 30000,
    paramsSerializer: {
        // @ts-ignore
        encode: qs.parse,
        // @ts-ignore
        serialize: qs.stringify,
    },
    // @ts-ignore
    transformRequest: [dateTransformer].concat(axios.defaults.transformRequest),
});
export const GetFileUrl = (fileId: string) => {
    return import.meta.env.VITE_API_URL + '/api/pos/upload-file/get-file/' + fileId;
}
