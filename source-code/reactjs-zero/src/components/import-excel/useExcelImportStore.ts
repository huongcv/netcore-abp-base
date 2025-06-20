import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {ExcelImportState, IExcelImportConfig} from "@ord-components/import-excel/types";

export const createExcelImportStore = <T>() => create<ExcelImportState<T>>()(
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
                    const {successImportList, errorImportList, errorFile} = await config.validateImport(excelData);

                    set({
                        validList: successImportList ?? [],
                        invalidList: errorImportList ?? [],
                        fileInfo: errorFile,
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

                    const result = await config.import(validList);

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

            downloadTemplate: async (config: IExcelImportConfig<T>) => {
                try {
                    set({isLoading: true});
                    const response = await config.exportTemplate();
                    FileSaver.saveAs(response, config.templateFileName);
                } catch (error) {
                    set({message: "Lỗi tải template"});
                } finally {
                    set({isLoading: false});
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
