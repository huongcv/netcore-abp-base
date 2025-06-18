import {observer} from "mobx-react-lite";
import {Button, Table} from "antd";
import React, {ReactNode, useEffect, useState} from "react";
import {ColumnType} from "antd/es/table/interface";
import {ProductImportDto, ProductImportKiotVietDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {SaveOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {ProductImportExcelService} from "@api/ProductImportExcelService";
import {l} from "@ord-core/language/lang.utils";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import GroupButtonFileExcel from "@ord-components/excel/GroupButtonFileExcel";
import NumberUtil from "@ord-core/utils/number.util";
import {EXPORT_TYPE_PRODUCT} from "@pages/ProductManagement/Product/import-excel/ExcelFileUploadForm";

export const BaseColumnImportProduct: ColumnType<ProductImportDto | ProductImportKiotVietDto>[] = [
    {
        title: ('code'),
        dataIndex: ('productCode'),
        width: 120,
        key: '1'
    },
    {
        title: ('name'),
        dataIndex: 'productName',
        width: 300,
        key: '2'
    },
    {
        title: ('BasicUnitName'),
        dataIndex: 'basicUnitName',
        width: 170,
        key: '3'
    },
    {
        title: ('ProductPrice'),
        dataIndex: 'productPriceStr',
        align: 'end',
        width: 200,
        render: (v: string) => {
            return <span>{NumberUtil.formatStringOld(v, 20, 2)}</span>
        },
        key: '4'
    },
    {
        title: ('productPriceWithTax'),
        dataIndex: 'productPriceWithTaxStr',
        align: 'end',
        width: 200,
        render: (v: string) => {
            return <span>{NumberUtil.formatStringOld(v, 20, 2)}</span>
        },
        key: '6'
    },
    {
        title: ('TaxPercent'),
        dataIndex: 'taxPercent',
        align: 'end',
        width: 100,
        key: '7',
        render: (v: boolean) => {
            return <>{v} %</>;
        },
    },
    {
        title: ('isProductPriceIncludeTax'),
        dataIndex: 'isProductPriceIncludeTax',
        render: (v: boolean) => {
            return <StatusCell isActived={v}
                               trueText={l.transCommon("yes")}
                               falseText={l.transCommon("no")}
            />
        },
        align: 'center',
        width: 100,
        key: '8'
    },
];

const ListProductValid = (props: {
    setMessage: (message: string) => void,
    setTabBarExtra: (element: ReactNode | any) => void,
    data: ProductImportDto[] | ProductImportKiotVietDto[],
    file: File | undefined,
    typeExport: EXPORT_TYPE_PRODUCT,
    isProductChain: boolean
}) => {
    const {setMessage, setTabBarExtra, data, file, typeExport, isProductChain} = props;

    const {t} = useTranslation('product');
    const {t: tCommon} = useTranslation();
    const {t: tExcel} = useTranslation('product-excel');

    const initColumns: ColumnType<ProductImportDto | ProductImportKiotVietDto>[] | any = [
        ...BaseColumnImportProduct.map(it => ({
            ...it,
            title: t(it.title as string)
        }))
    ];

    const [saving, setSaving] = useState(false);
    const [hiddenButton, setHiddenButton] = useState<boolean>();
    const [columns, setColumns] = useState<ColumnType<ProductImportDto | ProductImportKiotVietDto>[] | any>();
    const [dataTable, setDataTable] = useState<ProductImportDto[] | ProductImportKiotVietDto[]>(data || []);

    const handlerSave = async () => {
        setSaving(true);
        UiUtils.setBusy();
        try {
            let response;
            
            if (typeExport === EXPORT_TYPE_PRODUCT.KIOT_VIET) {
                response = await ProductImportExcelService.insertKiotViet({
                    body: {
                        listProduct: data,
                        isProductChain: isProductChain
                    }
                });
            }else {
                response = await ProductImportExcelService.insert({
                    body: {
                        listProduct: data
                    }
                });
            }

            if (response.isSuccessful) {
                setColumns([...initColumns, {
                    title: l.transCommon('status'),
                    dataIndex: 'isValid',
                    align: 'center',
                    width: 140,
                    render: (_: boolean) =>
                        <StatusCell isActived={_}
                                    trueText={l.transCommon("success")}
                                    falseText={l.transCommon("failed")}
                        />
                }])

                setDataTable(response!.data!.data!);
                setHiddenButton(true);
                setTabBarExtra && setTabBarExtra(
                    <GroupButtonFileExcel fileValid={response!.data!.successFile!}
                                          fileInValid={response!.data!.errorFile!}
                                          countValid={response!.data!.data!.filter(x => x.isValid)?.length || 0}
                                          countInValid={response!.data!.data!.filter(x => !x.isValid)?.length || 0}
                    />);

                setMessage && setMessage("");
                UiUtils.showSuccess(tCommon('actionDone'));
            } else {
                setMessage && setMessage(response.message ?? "");
            }
        } catch (ex: any) {
            console.error(ex)
            setMessage && setMessage(ex?.message || "");
        } finally {
            setSaving(false);
            UiUtils.clearBusy();
        }
    }

    const reset = () => {
        setColumns(initColumns);
        setMessage('');
        setHiddenButton(false);
        setTabBarExtra(null);
        setSaving(false);
    }

    useEffect(() => {
        setDataTable(data);
    }, [data]);

    useEffect(() => {
        reset();
    }, [file]);

    return (<>
        <Table
            bordered={true}
            columns={columns}
            dataSource={dataTable.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
        {
            !!dataTable?.length &&
            <div className={'mt-2'}>
                <Button onClick={handlerSave} hidden={hiddenButton} loading={saving} type={'primary'}
                        icon={<SaveOutlined/>}>{tExcel('saveListValid')}</Button>
            </div>
        }

    </>)
}
export default observer(ListProductValid);
