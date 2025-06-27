import {ColumnType} from "antd/es/table/interface";
import {IRequestOptions} from "@api/base/index.defs";
import {ICommonResultDtoApi} from "@ord-components/paged-table/types";

export interface IImportApiService<T> {
    validateDataImport(
        params: {
            body?: T[];
        },
        options?: IRequestOptions
    ): Promise<ICommonResultDtoApi<IImportOutputDtoDto<T>>>;

    downloadSampleTemplate(options: IRequestOptions): Promise<any>;

    import(
        params: {
            body?: T[];
        },
        options?: IRequestOptions
    ): Promise<ICommonResultDtoApi<IImportOutputDtoDto<T>>>;
}

export interface IImportOutputDtoDto<T> {
    errorImportList?: T[];
    successImportList?: T[];
}

export interface IExcelReader<T> {
    mapDataFromBinaryStrExcel(binaryStrExcel: string): T[];

    mapData(jsonData: any[][]): T[];
}

export interface IExcelImportConfig<T> {

    excelReader: IExcelReader<T>,

    // Configuration
    maxRows?: number;

    // Table columns
    getColumns: (isValid: boolean) => ColumnType<T>[];

    // Optional callbacks
    onImportSuccess?: () => void;
    clearDataSource?: () => void;
}

export interface ExcelImportState<T> {
    // State
    binaryStrExcel: string;
    validList: T[];
    invalidList: T[];
    message: string;
    fileInfo: any;
    isLoading: boolean;
    isImporting: boolean;

    // Excel data
    excelData: T[];
    excelError: string | null;

    // Actions
    setBinaryStrExcel: (binary: string) => void;
    setValidList: (list: T[]) => void;
    setInvalidList: (list: T[]) => void;
    setMessage: (message: string) => void;
    setFileInfo: (info: any) => void;
    setLoading: (loading: boolean) => void;
    setImporting: (importing: boolean) => void;
    processExcelData: (config: IExcelImportConfig<T>) => void;
    validateData: (config: IExcelImportConfig<T>) => Promise<void>;
    importData: (config: IExcelImportConfig<T>) => Promise<any>;
    downloadTemplate: () => void;
    reset: () => void;
}