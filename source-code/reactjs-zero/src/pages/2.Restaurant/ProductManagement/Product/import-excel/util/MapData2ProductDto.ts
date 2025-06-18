import {ProductDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

class MapData2ProductDto {
    private _productTypes: IOrdSelectOption[] = [];
    private _productGroups: IOrdSelectOption[] = [];

    setProductTypes(combo: IOrdSelectOption[]) {
        this._productTypes = combo;
    }

    setProductGroups(combo: IOrdSelectOption[]) {
        this._productGroups = combo;
    }

    mapProduct(jsonData: any[][]): ProductDto[] {
        if (!jsonData || !(jsonData.length > 0)) {
            return [];
        }
        const products: ProductDto[] = [];
        const lstHeaderName: string[] = [];
        jsonData.forEach(row => {
            if (lstHeaderName.length === 0) {
                const fts = row.map(it => {
                    return Utils.toLowerCaseNonAccentVietnamese(it);
                });
                fts.forEach(it => {
                    const header = this.mapHeader(it);
                    if (!!header) {
                        lstHeaderName.push(header);
                    }
                });

            } else {
                if (row && row.length > 0) {
                    const newProduct: ProductDto = {};
                    let idx = 0;
                    row.forEach(cellValue => {
                        if (cellValue != '') {
                            try {
                                this.parseCellValue2Product(lstHeaderName[idx], cellValue, newProduct);
                            } catch {

                            }
                        }
                        idx++;
                    });
                    products.push(newProduct);
                }
            }
        });
        return products;
    }

    private mapHeader(headerExcel: string) {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('ten san pham') > -1) {
            return 'productName';
        }
        if (headerExcel.indexOf('loai san pham') > -1) {
            return 'productTypeName';
        }
        if (headerExcel.indexOf('nhom san pham') > -1) {
            return 'productGroupName';
        }
        if (headerExcel.indexOf('gia ban') > -1) {
            return 'productPrice';
        }
        if (headerExcel.indexOf('don vi co ban') > -1) {
            return 'basicUnitName';
        }
        if (headerExcel.indexOf('ma vach') > -1) {
            return 'barcode';
        }
        if (headerExcel.indexOf('vat') > -1) {
            return 'vatName';
        }
        if (headerExcel.indexOf('quan ly ton kho') > -1) {
            return 'isProductUseInventoryName';
        }
        if (headerExcel.indexOf('quan ly so lo') > -1) {
            return 'isProductUseLotNumberName';
        }
        if (headerExcel.indexOf('ton kho') > -1) {
            return 'inventoryCurrentQty';
        }
        if (headerExcel.indexOf('gia von') > -1) {
            return 'inventoryCurrentCostPrice';
        }
        return null;
    }

    private parseCellValue2Product(header: string, cellValue: any, newProduct: ProductDto) {
        if (header === 'productTypeName') {
            // @ts-ignore
            const f = this._productTypes.find(x => x.label == cellValue);
            if (f) {
                // @ts-ignore
                newProduct.productTypeId = f.value;
            }
            return;
        }
        if (header === 'productGroupName') {
            // @ts-ignore
            const f = this._productGroups.find(x => x.label == cellValue);
            if (f) {
                // @ts-ignore
                newProduct.listProductGroupId = [f.value];
            }
            return;
        }
        if (header == 'isProductUseInventoryName') {
            const v = Utils.toLowerCaseNonAccentVietnamese(cellValue);
            newProduct.isProductUseInventory = v.indexOf('co') > -1;
            return;
        }
        if (header == 'isProductUseLotNumberName') {
            const v = Utils.toLowerCaseNonAccentVietnamese(cellValue);
            newProduct.isProductUseLotNumber = v.indexOf('co') > -1;
            return;
        }
        if (header == 'vatName') {
            const v = Utils.toLowerCaseNonAccentVietnamese(cellValue);
            if (v.indexOf('10') > -1) {
                newProduct.taxPercent = 0.1;
                return;
            }
            if (v.indexOf('8') > -1) {
                newProduct.taxPercent = 0.08;
                return;
            }
            if (v.indexOf('5') > -1) {
                newProduct.taxPercent = 0.05;
                return;
            }
            if (v.indexOf('0') > -1) {
                newProduct.taxPercent = 0;
                return;
            }
            return;
        }


        // @ts-ignore
        newProduct[header] = cellValue;
    }
}

export default new MapData2ProductDto();
