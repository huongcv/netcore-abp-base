// import {CommonResultDto} from "@ord-core/service-proxies/dto";
import uiUtils from "@ord-core/utils/ui.utils";
import {l} from "@ord-core/language/lang.utils";
import {CommonResultDto} from "@ord-core/service-proxies/dto";

class ServiceProxyUtils {
    notifyCommonResultApi(dataResult: CommonResultDto<any>, ns = 'common', extendData: any = null) {
        if (dataResult.isSuccessful) {
            this.notifySuccessResultApi(dataResult, ns, extendData);

        } else {
            this.notifyErrorResultApi(dataResult, ns, extendData);
        }
    }

    notifyErrorResultApi(dataResult: CommonResultDto<any>, ns = 'common', extendData: any = null) {
        if (dataResult.isSuccessful) {
            return;
        }
        if (!!dataResult.message) {
            uiUtils.showError(dataResult.message);
        }
        // if (dataResult.errorDetail && dataResult.errorDetail.code) {
        //     uiUtils.showError(l.trans(ns + '.' + dataResult.errorDetail.code, {
        //         ...dataResult?.errorDetail?.data,
        //         ...extendData
        //     }));
        //     return;
        // }
        //
        // if (dataResult.errorDetail && dataResult.errorDetail.message) {
        //     uiUtils.showError(l.trans(ns + '.' + dataResult.errorDetail.message, {
        //         ...dataResult?.errorDetail?.data,
        //         ...extendData
        //     }));
        //     return;
        // }
        //
        // if (dataResult.errors && dataResult.errors.length > 0 && dataResult.errors[0].errorMessage) {
        //     uiUtils.showError(l.trans(ns + '.' + dataResult.errors[0].errorMessage, {
        //         ...dataResult.errors[0],
        //         ...extendData
        //     }));
        //     return;
        // }
    }

    notifySuccessResultApi(dataResult: CommonResultDto<any>, ns = 'common', extendData: any = null) {
        if (dataResult.notification?.message) {
            uiUtils.showSuccess(l.trans(ns + '.' + dataResult.notification?.message, {
                ...dataResult.notification?.data,
                ...extendData
            }));
        }
    }
}

export default new ServiceProxyUtils();
