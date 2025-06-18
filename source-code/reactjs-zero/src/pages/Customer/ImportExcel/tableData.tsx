import {Button, Select, Table, TableProps} from "antd";
import React, {memo, ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DownloadOutlined, SaveOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {useNavigate} from "react-router";
import FileSaver from "file-saver";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import {ColumnType} from "antd/es/table";
import {isEqual} from "lodash";
import {l} from "@ord-core/language/lang.utils";
import {ImportPartnerInputDto, ImportPartnerOutputDto, TplFileInfo} from "@api/index.defs";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {UploadFileService} from "@api/UploadFileService";
import {CustomerService} from "@api/CustomerService";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import utils from "@ord-core/utils/utils";

export const ErrorCell = (props: {
    partner: ImportPartnerInputDto
}) => {
    const {t} = useTranslation('customer');
    const {listErrorValidData: listError} = props.partner;
    return (<ul className={'ms-[15px] list-disc'}>
        {
            !!listError &&
            listError.map((it, idx) => (<li key={idx} className={'text-red-500'}>
                {t(it.error ?? "") as any}
            </li>))
        }
    </ul>);
}
export const CustomerDataTableExcel = (props: {
    datasource: ImportPartnerInputDto[],
    isValid: boolean,
    setMessage?: (message: string) => void
    fileInfo?: TplFileInfo | undefined,
    setTabBarExtra?: (element: ReactNode | any) => void
}) => {
    const {t} = useTranslation('customer');
    const {t: tEnum} = useTranslation('enum');
    const {t: tExcel} = useTranslation('excel');
    const {datasource, isValid, setTabBarExtra} = props;
    const [saving, setSaving] = useState(false);
    const [hiddenButton, setHiddenButton] = useState(false);
    const [isReValid, setIsReValid] = useState<boolean>(isValid);
    const [dataExcel, setDataExcel] = useState<ImportPartnerInputDto[]>(datasource);

    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    const baseColumn: ColumnType<ImportPartnerInputDto>[] = [
        {
            title: t('detailError'),
            width: 300,
            hidden: isReValid,
            render: (_, dto) => {
                return <ErrorCell partner={dto}/>;
            }
        },
        {
            title: t('code'),
            dataIndex: 'code',
            key: 'code',
            width: 150
        },
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            width: 150
        },
        {
            title: t('type'),
            dataIndex: 'categoryStr',
            key: 'categoryStr',
            width: 150,
            render: (v, record: any) => {
                return <>
                    {record.categoryStr ? tEnum(record.categoryStr) : ""}
                </>;
            },
        },
        {
            title: t('gender'),
            dataIndex: 'genderStr',
            key: 'genderStr',
            width: 100,
            render: (v, record: any) => {
                return <>
                    {record.genderStr ? tEnum(record.genderStr) : ""}
                </>;
            },
        },
        {
            title: t('groupId'),
            dataIndex: 'groupName',
            key: 'groupName',
            width: 150,
        },
        {
            title: t('phone'),
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: t('taxCode'),
            dataIndex: 'taxCode',
            key: 'taxCode',
            width: 150,
        },
        {
            title: t('debtAmount'),
            dataIndex: 'debtAmount',
            key: 'debtAmount',
            align: 'right',
            width: 150,
            render: (v) => {
                return v ? formatter.format(Number(v)) : "-"
            }
        },
        {
            title: t('notes'),
            dataIndex: 'notes',
            key: 'notes',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text}/>
        },
    ]
    const [columns, setColumns] = useState<ColumnType<ImportPartnerInputDto>[]>(baseColumn);

    const handlerSave = async () => {
        setSaving(true);
        UiUtils.setBusy();
        try {
            let result = await CustomerService.import({
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
                UiUtils.showSuccess(t('actionDone', {ns: 'common'}));
                setHiddenButton(true);
                const dataResult = ((result.data?.successImportList || []).concat(result.data?.errorImportList || [])) as ImportPartnerInputDto[];
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
            }, {responseType: 'blob'})
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
        <Table<ImportPartnerInputDto>
            bordered={false}
            scroll={{x: 'max-content'}}
            sticky={{offsetHeader: 1}}
            columns={columns}
            dataSource={dataExcel.map((x, idx) => ({key: idx, ...x}))}
        />

        {
            !props.isValid && props.datasource.length > 0 && props?.fileInfo?.fileId &&
            <div className={'mt-2 float-right'}>
                <Button onClick={handlerDownloadErrorAfterValid} loading={saving}
                        icon={<DownloadOutlined/>}>{t('downloadListInValid', {ns: 'excel'})}</Button>
            </div>
        }
        {
            props.isValid && props.datasource.length > 0 &&
            <div className={'mt-2 float-right'}>
                <Button onClick={handlerSave} loading={saving} hidden={hiddenButton} type={'primary'}
                        icon={<SaveOutlined/>}>{t('saveListValid', {ns: 'excel'})}</Button>
            </div>
        }
    </>);
}
