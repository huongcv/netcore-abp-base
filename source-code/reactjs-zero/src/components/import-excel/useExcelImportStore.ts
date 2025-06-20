import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {
    ExcelImportState,
    IExcelImportConfig,
    IExcelReader,
    IImportApiService
} from "@ord-components/import-excel/types";
import {IRequestOptions} from "@api/index.defs";

export const createExcelImportStore = <T>(apiService: IImportApiService<T>) => create<ExcelImportState<T>>()(
    devtools(
        (set, get) => ({
            // Initial state
            binaryStrExcel: '',
            validList: [],
            invalidList: [],
            message: '',
            fileInfo: null,
            isLoading: false,
            isImporting: false,
            excelData: [],
            excelError: null,

            // Actions
            setBinaryStrExcel: (binary: string) => {
                set({binaryStrExcel: binary});
                if (binary) {
                    // Auto process when binary changes
                    const currentConfig = (get() as any).currentConfig;
                    if (currentConfig) {
                        get().processExcelData(currentConfig);
                    }
                } else {
                    get().reset();
                }
            },

            setValidList: (list: T[]) => set({validList: list}),
            setInvalidList: (list: T[]) => set({invalidList: list}),
            setMessage: (message: string) => set({message}),
            setFileInfo: (info: any) => set({fileInfo: info}),
            setLoading: (loading: boolean) => set({isLoading: loading}),
            setImporting: (importing: boolean) => set({isImporting: importing}),

            processExcelData: (config: IExcelImportConfig<T>) => {
                const {binaryStrExcel} = get();
                if (!binaryStrExcel) {
                    set({excelData: [], excelError: null});
                    return;
                }

                try {
                    const maxRowAvailable = (config.maxRows || 2000);
                    const items = config.excelReader.mapDataFromBinaryStrExcel(binaryStrExcel);
                    if (!items.length) {
                        throw new Error("Không có dữ liệu hợp lệ");
                    }
                    if (items.length > maxRowAvailable) {
                        throw new Error(`Quá ${config.maxRows || 2000} dòng dữ liệu`);
                    }
                    set({excelData: items, excelError: null});

                    // Auto validate after processing
                    get().validateData(config);

                } catch (ex: any) {
                    set({
                        excelData: [],
                        excelError: ex?.message || "Lỗi xử lý file Excel",
                        message: ex?.message || "Lỗi xử lý file Excel"
                    });
                }
            },

            validateData: async (config: IExcelImportConfig<T>) => {
                const {excelData} = get();
                if (!excelData.length) return;

                try {
                    set({isLoading: true, message: ''});
                    const {
                        data
                    } = await apiService.validateDataImport({
                        body: excelData || []
                    });
                    if (!data) {
                        throw new Error("Lỗi xác thực dữ liệu");
                    }
                    const {errorImportList, successImportList} = data;
                    set({
                        validList: successImportList ?? [],
                        invalidList: errorImportList ?? [],
                        fileInfo: {},
                        message: ""
                    });
                } catch (error) {
                    set({message: "Lỗi xác thực dữ liệu"});
                } finally {
                    set({isLoading: false});
                }
            },

            importData: async (config: IExcelImportConfig<T>) => {
                const {validList} = get();
                if (!validList.length) return null;

                try {
                    set({isImporting: true});
                    UiUtils.setBusy();

                    const result = await apiService.import({
                        body: validList
                    });

                    if (result.isSuccessful) {
                        UiUtils.showSuccess('Import thành công');
                        config.onImportSuccess?.();
                        config.clearDataSource?.();
                        return result.data;
                    } else {
                        set({message: 'Import thất bại'});
                        return null;
                    }
                } catch (error) {
                    set({message: 'Lỗi import dữ liệu'});
                    return null;
                } finally {
                    set({isImporting: false});
                    UiUtils.clearBusy();
                }
            },

            downloadTemplate: async () => {
                try {
                    UiUtils.setBusy();
                    set({isLoading: true});
                    let options: IRequestOptions = {
                        responseType: "blob",
                    }
                    const resultBlob = await apiService.downloadSampleTemplate(options);
                    const contentDisposition = sessionStorage.getItem('content-disposition');
                    let fileName = 'download.xlsx';
                    const fileNameMatch = contentDisposition?.match(/filename\*=UTF-8''(.+\.xlsx)/);
                    if (fileNameMatch && fileNameMatch[1]) {
                        fileName = decodeURIComponent(fileNameMatch[1]);
                    }
                    FileSaver.saveAs(resultBlob, fileName);
                } catch (error) {
                    set({message: "Lỗi tải template"});
                } finally {
                    set({isLoading: false});
                    UiUtils.clearBusy();
                }
            },

            reset: () => set({
                binaryStrExcel: '',
                validList: [],
                invalidList: [],
                message: '',
                fileInfo: null,
                isLoading: false,
                isImporting: false,
                excelData: [],
                excelError: null
            })
        }),
        {
            name: 'excel-import-store',
        }
    )
);
