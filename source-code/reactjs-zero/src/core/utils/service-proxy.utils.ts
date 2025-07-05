// import {CommonResultDto} from "@ord-core/service-proxies/dto";
import uiUtils from "@ord-core/utils/ui.utils";
import {CommonResultDto} from "@ord-core/service-proxies/dto";

class ServiceProxyUtils {

    notifyErrorResultApi(dataResult: CommonResultDto<any>, ns = 'common', extendData: any = null) {
        if (dataResult.isSuccessful) {
            return;
        }
        if (!!dataResult.message) {
            uiUtils.showError(dataResult.message);
        }
    }
}

export default new ServiceProxyUtils();
