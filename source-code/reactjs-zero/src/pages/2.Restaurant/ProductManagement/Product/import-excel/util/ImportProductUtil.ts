import Utils from "@ord-core/utils/utils";

class ImportProductUtil {
    eqProduct = (p1: {
        productCode?: string,
        productName?: string,
    }, p2: {
        productCode?: string,
        productName?: string,
    }) => {
        let ret = false;
        if (!p1.productCode && !p1.productName) {
            return false;
        }
        if (!p2.productCode && !p2.productName) {
            return false;
        }
        if (!!p1.productCode && !!p2.productCode) {
            ret = Utils.toLowerCaseNonAccentVietnamese(p1.productCode) == Utils.toLowerCaseNonAccentVietnamese(p2.productCode);
        }
        if (!ret && !!p1.productName && !!p2.productName) {
            ret = Utils.toLowerCaseNonAccentVietnamese(p1.productName) == Utils.toLowerCaseNonAccentVietnamese(p2.productName);
        }
        return ret;
    }
}

export default new ImportProductUtil();
