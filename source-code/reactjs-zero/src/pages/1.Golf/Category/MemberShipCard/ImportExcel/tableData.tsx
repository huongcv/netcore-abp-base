import { Button, Select, Table, TableProps } from "antd";
import React, { memo, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DownloadOutlined, SaveOutlined } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { useNavigate } from "react-router";
import FileSaver from "file-saver";
import { StatusCell } from "@ord-components/table/cells/StatusCell";
import { ColumnType } from "antd/es/table";
import { isEqual } from "lodash";
import { l } from "@ord-core/language/lang.utils";
import { ImportExcelAccessCardInputDto, ImportPartnerOutputDto, TplFileInfo } from "@api/index.defs";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { UploadFileService } from "@api/UploadFileService";
import { CustomerService } from "@api/CustomerService";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import { SupplierService } from "@api/SupplierService";
import { AccessCardService } from "@api/AccessCardService";

export const ErrorCell = (props: {
    partner: ImportExcelAccessCardInputDto
}) => {
    const { t } = useTranslation('golf_access_card');
    const { listErrorValidData: listError } = props.partner;
    return (<ul className={'ms-[15px] list-disc'}>
        {
            !!listError &&
            listError.map((it, idx) => (<li key={idx} className={'text-red-500'}>
                {t(it.error ?? "") as any}
            </li>))
        }
    </ul>);
}
export const AccessCardDataTableExcel = (props: {
    datasource: ImportExcelAccessCardInputDto[],
    isValid: boolean,
    setMessage?: (message: string) => void
    fileInfo?: TplFileInfo | undefined,
    setTabBarExtra?: (element: ReactNode | any) => void
}) => {
    const { t } = useTranslation('golf_access_card');
    const { t: tEnum } = useTranslation('enum');
    const { t: tExcel } = useTranslation('excel');
    const { datasource, isValid, setTabBarExtra } = props;
    const [saving, setSaving] = useState(false);
    const [hiddenButton, setHiddenButton] = useState(false);
    const [isReValid, setIsReValid] = useState<boolean>(isValid);
    const [dataExcel, setDataExcel] = useState<ImportExcelAccessCardInputDto[]>(datasource);

    const baseColumn: ColumnType<ImportExcelAccessCardInputDto>[] = [
        {
            key: "rowIndex",
            title: l.transCommon("sttRow"),
            render: (_, record: any, idx) => <div>{record?.ordRowIndex ?? (idx + 1)}</div>,
            width:  60,
            align: "center",
        },
        {
            title: t('detailError'),
            width: 300,
            hidden: isReValid,
            render: (_, dto) => {
                return <ErrorCell partner={dto} />;
            }
        },
        {
            title: t('uid'),
            dataIndex: 'uid',
            key: 'uid',
            width: 150
        },
        {
            title: t('printedNumber'),
            dataIndex: 'printedNumber',
            key: 'printedNumber',
            width: 150
        },
       
        {
            title: t('accessCardColor'),
            dataIndex: 'strAccessCardColor',
            key: 'strAccessCardColor',
            width: 150,
        },

        {
            title: t('description'),
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text} />
        },
    ]
    const [columns, setColumns] = useState<ColumnType<ImportExcelAccessCardInputDto>[]>(baseColumn);

    const handlerSave = async () => {
        setSaving(true);
        UiUtils.setBusy();
        try {
            let result = await AccessCardService.import({
                body: datasource
            });

            if (result.isSuccessful) {
                setColumns([...baseColumn, {
                    title: t("status"),
                    dataIndex: 'isError',
                    align: 'center',
                    width: 140,
                    render: (_: boolean) => <StatusCell isActived={!_}
                        falseText={l.transCommon("failed")}
                        trueText={l.transCommon("success")}
                    />
                }]);
                UiUtils.showSuccess(t('actionDone', { ns: 'common' }));
                setHiddenButton(true);
                const dataResult = ((result.data?.successImportList || []).concat(result.data?.errorImportList || [])) as ImportExcelAccessCardInputDto[];
                setDataExcel(dataResult);
                setTabBarExtra && setTabBarExtra(
                    <GroupButtonFileExcel fileValid={result!.data!.successFile as any}
                        fileInValid={result!.data!.errorFile as any}
                        countValid={dataResult?.filter(x => !x.isError)?.length || 0}
                        countInValid={dataResult?.filter(x => x.isError)?.length || 0}
                    />);
            } else {
                props.setMessage && props.setMessage(t('actionError'));
            }
        } catch {
            props.setMessage && props.setMessage(t('actionError'));
        } finally {
            setSaving(false);
            UiUtils.clearBusy();
        }
    }

    const handlerDownloadErrorAfterValid = async () => {
        setSaving(true);
        UiUtils.setBusy();
        try {
            let blob = await UploadFileService.getFileFromCache({
                fileCacheId: props.fileInfo?.fileId || '',
            }, { responseType: 'blob' })
            FileSaver.saveAs(blob, props.fileInfo?.fileName);
        } catch {
            props.setMessage && props.setMessage(t('actionError'));
        } finally {
            setSaving(false);
            UiUtils.clearBusy();
        }
    }

    const reset = () => {
        setTabBarExtra && setTabBarExtra(null);
        setHiddenButton(false);
        setColumns(baseColumn);
        setSaving(false);
    }

    useEffect(() => {
        reset();
        setDataExcel(datasource);
    }, [datasource]);

    useEffect(() => {
        setColumns([...baseColumn]);
    }, [isReValid])

    return (<>
        <Table<ImportExcelAccessCardInputDto>
            bordered={false}
            scroll={{ x: 'max-content' }}
            sticky={{ offsetHeader: 1 }}
            columns={columns}
            dataSource={dataExcel.map((x, idx) => ({ key: idx, ...x }))}
        />

        {
            !props.isValid && props.datasource.length > 0 && props?.fileInfo?.fileId &&
            <div className={'mt-2 float-right'}>
                <Button onClick={handlerDownloadErrorAfterValid} loading={saving}
                    icon={<DownloadOutlined />}>{t('downloadListInValid', { ns: 'excel' })}</Button>
            </div>
        }
        {
            props.isValid && props.datasource.length > 0 &&
            <div className={'mt-2 float-right'}>
                <Button onClick={handlerSave} loading={saving} hidden={hiddenButton} type={'primary'}
                    icon={<SaveOutlined />}>{t('saveListValid', { ns: 'excel' })}</Button>
            </div>
        }
    </>);
}
