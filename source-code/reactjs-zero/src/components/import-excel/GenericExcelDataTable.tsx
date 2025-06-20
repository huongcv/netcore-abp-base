import React, {ReactNode, useEffect, useState} from "react";
import {Button, Table} from "antd";
import {ColumnType} from "antd/es/table/interface";
import {useTranslation} from "react-i18next";
import {DownloadOutlined, SaveOutlined} from "@ant-design/icons";
import {UploadFileService} from "@api/UploadFileService";
import FileSaver from "file-saver";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import {l} from "@ord-core/language/lang.utils";

interface IGenericExcelDataTableProps<T> {
    datasource: T[];
    isValid: boolean;
    columns: ColumnType<T>[];
    setMessage?: (message: string) => void;
    fileInfo?: any;
    setTabBarExtra?: (element: ReactNode | any) => void;
    onImport?: () => Promise<any>;
    isImporting?: boolean;
}

export const GenericExcelDataTable = <T extends Record<string, any>>(
    props: IGenericExcelDataTableProps<T>
) => {
    const {
        datasource,
        isValid,
        columns,
        setTabBarExtra,
        onImport,
        setMessage,
        fileInfo,
        isImporting = false
    } = props;

    const {t} = useTranslation();
    const [hiddenButton, setHiddenButton] = useState(false);
    const [dataExcel, setDataExcel] = useState<T[]>(datasource);
    const [saving, setSaving] = useState(false);
    const [tableColumns, setTableColumns] = useState<ColumnType<T>[]>(columns);

    const handleSave = async () => {
        if (!onImport) return;

        setSaving(true);
        try {
            const result = await onImport();
            if (result) {
                setHiddenButton(true);

                // Add status column to show import results
                const statusColumn: ColumnType<T> = {
                    title: t("status"),
                    dataIndex: 'isError',
                    align: 'center',
                    width: 140,
                    render: (isError: boolean) => (
                        <StatusCell
                            isActived={!isError}
                            falseText={l.transCommon("failed")}
                            trueText={l.transCommon("success")}
                        />
                    )
                };

                setTableColumns([...columns, statusColumn]);

                // Update data with results
                const dataResult = (result.successImportList || []).concat(result.errorImportList || []);
                setDataExcel(dataResult);

                // Set tab bar extra with download buttons
                setTabBarExtra?.(
                    <GroupButtonFileExcel
                        fileValid={result.successFile}
                        fileInValid={result.errorFile}
                        countValid={dataResult?.filter((x: any) => !x.isError)?.length || 0}
                        countInValid={dataResult?.filter((x: any) => x.isError)?.length || 0}
                    />
                );
            }
        } catch (error) {
            setMessage?.(t('actionError'));
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadError = async () => {
        if (!fileInfo?.fileId) return;

        setSaving(true);
        try {
            const blob = await UploadFileService.getFileFromCache({
                fileCacheId: fileInfo.fileId,
            }, {responseType: 'blob'});
            FileSaver.saveAs(blob, fileInfo.fileName);
        } catch {
            setMessage?.(t('actionError'));
        } finally {
            setSaving(false);
        }
    };

    const reset = () => {
        setTabBarExtra?.(null);
        setHiddenButton(false);
        setTableColumns(columns);
        setSaving(false);
    };

    useEffect(() => {
        reset();
        setDataExcel(datasource);
    }, [datasource]);

    useEffect(() => {
        setTableColumns(columns);
    }, [columns]);

    return (
        <>
            <Table<T>
                bordered={false}
                scroll={{x: 'max-content'}}
                sticky={{offsetHeader: 1}}
                columns={tableColumns}
                dataSource={dataExcel.map((x, idx) => ({key: idx, ...x} as T))}
                loading={isImporting}
            />

            {/* Download Error File Button for Invalid Tab */}
            {!isValid && datasource.length > 0 && (
                <div className={'mt-2 float-right'}>
                    <Button
                        onClick={handleDownloadError}
                        loading={saving}
                        icon={<DownloadOutlined/>}
                    >
                        {t('downloadListInValid', {ns: 'excel'})}
                    </Button>
                </div>
            )}

            {/* Save Button for Valid Tab */}
            {isValid && datasource.length > 0 && onImport && (
                <div className={'mt-2 float-right'}>
                    <Button
                        onClick={handleSave}
                        loading={saving || isImporting}
                        hidden={hiddenButton}
                        type={'primary'}
                        icon={<SaveOutlined/>}
                    >
                        {t('saveListValid', {ns: 'excel'})}
                    </Button>
                </div>
            )}
        </>
    );
};