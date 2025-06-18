import {ProductLotNumberInitDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import DateUtil from "@ord-core/utils/date.util";

export interface MapLotNumberDto extends ProductLotNumberInitDto {
    productCode?: string,
    productName?: string,
}

class MapData2ProductLotNumberDto {
    mapLotnumber(jsonData: any[][]): MapLotNumberDto[] {
        if (!jsonData || !(jsonData.length > 0)) {
            return [];
        }
        const lstHeaderName: string[] = [];
        const lotnumbers: MapLotNumberDto[] = [];
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
                    let idx = 0;
                    const newValue: MapLotNumberDto = {};
                    row.forEach(cellValue => {
                        if (cellValue != '') {
                            try {
                                this.parseCellValue(lstHeaderName[idx], cellValue, newValue);
                            } catch {

                            }
                        }
                        idx++;
                    });
                    if (!!newValue.lotNumber && newValue.lotNumber != '') {
                        lotnumbers.push(newValue);
                    }

                }
            }
        });
        return lotnumbers;
    }

    private mapHeader(headerExcel: string) {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('ten san pham') > -1) {
            return 'productName';
        }
        if (headerExcel.indexOf('so lo') > -1) {
            return 'lotNumber';
        }
        if (headerExcel.indexOf('han su dung') > -1) {
            return 'expiryDateStr';
        }
        if (headerExcel.indexOf('gia von') > -1) {
            return 'costPrice';
        }
        if (headerExcel.indexOf('ton kho') > -1) {
            return 'qty';
        }
        return null;
    }

    private parseCellValue(header: string, cellValue: any, newItem: MapLotNumberDto) {
        if (header == 'expiryDateStr') {
            if (!!cellValue) {
                newItem.expiryDate = DateUtil.convertExcelValue(cellValue);
            }
            return;
        }
        // @ts-ignore
        newItem[header] = cellValue;
    }
}

export default new MapData2ProductLotNumberDto();
