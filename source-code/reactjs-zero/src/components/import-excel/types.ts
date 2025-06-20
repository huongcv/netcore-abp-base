import {ColumnType} from "antd/es/table/interface";

export interface IExcelReader<T> {
    mapDataFromBinaryStrExcel(binaryStrExcel: string): T[];

    mapData(jsonData: any[][]): T[];
}

export interface IExcelImportConfig<T> {
    // Service methods
    exportTemplate: () => Promise<Blob>;
    validateImport: (items: T[]) => Promise<{
        successImportList: T[];
        errorImportList: T[];
        errorFile?: any;
    }>;
    import: (items: T[]) => Promise<{
        isSuccessful: boolean;
        data?: {
            successImportList: T[];
            errorImportList: T[];
            successFile: any;
            errorFile: any;
        };
    }>;

    excelReader: IExcelReader<T>,

    // Configuration
    maxRows?: number;
    fieldCount: number;
    templateFileName: string;

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
    downloadTemplate: (config: IExcelImportConfig<T>) => Promise<void>;
    reset: () => void;
}