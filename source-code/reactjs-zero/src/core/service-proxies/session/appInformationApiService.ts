import baseHttpApi from "@ord-core/service-proxies/httpService";
import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import ThemeUtil from "@ord-core/theme/ord-theme.config";


class AppInformationApiService {
    public async getBoostrap(): Promise<AppBootstrapDto> {
        const result = await baseHttpApi.get('/api/auth/information/get-bootstrap');
        const data = result.data?.data as AppBootstrapDto;
        // if (!!data.currentShopHashId && !!data.user?.id) {
        //     CurrentShopUtil.setShop(data.currentShop);
        // }
        if(data && data.theme){
            ThemeUtil.initData(data.theme)

        }
        return data;
    }
}

export default new AppInformationApiService();
