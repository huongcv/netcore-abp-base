import Utils from "@ord-core/utils/utils";

export abstract class ReadDataExcelBase<TData> {
    isIncludeRowIndex = false;

    mapData(jsonData: any[][]): TData[] {
        if (!jsonData || !(jsonData.length > 0)) {
            return [];
        }
        const items: TData[] = [];
        const lstHeaderName: string[] = [];
        jsonData.forEach(row => {
            if (lstHeaderName.length === 0) {
                const fts = row.map(it => {
                    return Utils.toLowerCaseNonAccentVietnamese(it);
                });
                fts.forEach(it => {
                    const header = this.mapHeader(it);
                    if (!!header) {
                        if (lstHeaderName.length === 0 && this.isIncludeRowIndex) {
                            lstHeaderName.push('rowId');
                        }
                        lstHeaderName.push(header);
                    }
                });

            } else {
                if (row && row.length > 0) {
                    // @ts-ignore
                    const newItem: TData = {};
                    let idx = 0;
                    row.forEach(cellValue => {
                        if (cellValue != '') {
                            try {
                                this.parseCellValue2Data(lstHeaderName[idx], cellValue, newItem);
                            } catch {

                            }
                        }
                        idx++;
                    });
                    items.push(newItem);
                }
            }
        });
        return items;
    }

    abstract mapHeader(headerExcel: string): string | null;

    abstract parseCellValue2Data(header: string, cellValue: any, newItem: TData): void;
    getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
        return obj[key];
    }

    setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
        obj[key] = value;
    }
}
