import {ProductUnitDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";

export interface MapUnitDto extends ProductUnitDto {
    productCode?: string,
    productName?: string,
}

class MapData2ProductUnitDto {
    mapUnit(jsonData: any[][]): MapUnitDto[] {
        if (!jsonData || !(jsonData.length > 0)) {
            return [];
        }
        const lstHeaderName: string[] = [];
        const units: MapUnitDto[] = [];
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
                    const newValue: MapUnitDto = {};
                    row.forEach(cellValue => {
                        if (cellValue != '') {
                            try {
                                this.parseCellValue(lstHeaderName[idx], cellValue, newValue);
                            } catch {

                            }
                        }
                        idx++;
                    });
                    if (!!newValue.unitName && newValue.unitName != '') {
                        units.push(newValue);
                    }

                }
            }
        });
        return units;
    }

    private mapHeader(headerExcel: string) {
        if (headerExcel.indexOf('ma san pham') > -1) {
            return 'productCode';
        }
        if (headerExcel.indexOf('ten san pham') > -1) {
            return 'productName';
        }
        if (headerExcel.indexOf('ten dv') > -1) {
            return 'unitName';
        }
        if (headerExcel.indexOf('ty le') > -1) {
            return 'convertRate';
        }
        if (headerExcel.indexOf('gia ban') > -1) {
            return 'price';
        }
        if (headerExcel.indexOf('ma vach') > -1) {
            return 'barcode';
        }
        return null;
    }

    private parseCellValue(header: string, cellValue: any, newItem: MapUnitDto) {
        // @ts-ignore
        newItem[header] = cellValue;
    }
}

export default new MapData2ProductUnitDto();
