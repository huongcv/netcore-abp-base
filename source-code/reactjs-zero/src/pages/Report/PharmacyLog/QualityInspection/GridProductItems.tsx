import {
    ComboOptionDto,
    PharmacyLogReportQualityInspectionProductOutputDto, ProductFromInventoryWithUnitDto, ProductLotDto,
    ProductSearchWithUnitDto,
    ShopTemplateDetailsDto
} from "@api/index.defs";
import {
    AutoComplete,
    Button,
    Form,
    FormInstance,
    FormListFieldData,
    Input,
    InputNumber,
    Select,
    Table,
    Tag
} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {TableProps} from "antd/es/table/InternalTable";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import FormList from "antd/es/form/FormList";
import {DeleteOutlined} from "@ant-design/icons";
import SearchProduct from "@pages/Report/PharmacyLog/QualityInspection/SearchProduct/SearchProduct";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import useFilterInventoryLineByProduct from "@ord-core/db/queries/invetoryLines/useFilterInventoryLineByProduct";
import LotNumberWithStockInventoryInput
    from "@pages/StockManagement/Shared/Upsert/grid-product/forms/LotNumberWithStockInventoryInput";
import DateUtil from "@ord-core/utils/date.util";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import userFilterProductUnitsByProductId from "@ord-core/db/queries/products/userFilterProductUnitsByProductId";
import Utils from "@ord-core/utils/utils";
import {
    QtyInventoryStockWithUnit
} from "@pages/StockManagement/Shared/Upsert/grid-product/cells/QtyInventoryStockWithUnit";
import DateCell from "@ord-components/table/cells/DateCell";

interface IQualityInspectionPrDto extends PharmacyLogReportQualityInspectionProductOutputDto {
    rowKey: string,
    productName: string,
    productCode: string,
}

const detailsFieldName = "items";
type ColumnTypes = Exclude<TableProps<IQualityInspectionPrDto>['columns'], undefined>;
const GridProductItems = (props: {
    form: FormInstance,
    disable: boolean
}) => {

    const {reportPharmacyLogQualityInspectionReportStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());

    const {searchProductShopTplTableStore: searchProductStore} = useStore();

    useEffect(() => {
        props.form.setFieldValue(detailsFieldName, searchProductStore.selectedRows)
    }, [searchProductStore.selectedRows]);
    const handlerProductSelect = async (productSelected: ProductFromInventoryWithUnitDto) => {
        console.log("productSelected", {...productSelected})
        if (addRowRef.current) {
            const details: IQualityInspectionPrDto[] = props.form.getFieldValue(detailsFieldName);
            const indexFind = details.findIndex(x => x.rowKey == productSelected.rowkey);
            if (indexFind == -1) {
                addRowRef.current({
                    unitId: productSelected.productUnitId,
                    unitName: productSelected.unitName,
                    productName: productSelected.productName,
                    productCode: productSelected.productCode,
                    productId: productSelected.productId,
                    qty: productSelected.qty,
                    lotNumber: productSelected.lotNumber,
                    expiryDate: productSelected.expiryDate,
                    remarks: optionsRemarks[0].value,
                    isProductUseLotNumber: productSelected.isProductUseLotNumber,
                    rowKey: productSelected.rowkey
                })
            }
        }

    }
    const handlerMultiProductSelect = async (selectedProducts: ProductSearchWithUnitDto[]) => {
        selectedProducts.forEach(item => {
            handlerProductSelect(item);
        })
    }
    const RenderSelectPrUnit = (props: {
        prUnitId: string | undefined | number,
        productId: string | undefined,
        onChange: (value: any, option: IOrdSelectOption | IOrdSelectOption[]) => void;
    }) => {
        return <OrdSelect
            defaultValue={props.prUnitId}
            onChange={props.onChange}
            datasource={useSelectProductUnit(props.productId)}></OrdSelect>
    }

    const optionsReason = [
        {value: 'Định kỳ'},
        {value: 'Đột xuất'},
    ];
    const optionsRemarks = [
        {value: 'Đạt'},
        {value: 'Không đạt'},
    ];

    const columns: ColumnTypes = [
        {
            title: t('stt'),
            dataIndex: 'stt',
            width: '50px',
            render: (_: any, __: any, index: number) => (
                <span>{index + 1}</span>
            ),
        },
        {
            title: t('productCode'),
            dataIndex: 'productCode',
            width: '100px',
            render: (_: any, __: any, index: number) => {
                return props.form.getFieldValue([detailsFieldName, index, 'productCode'])
            },
        },
        {
            title: t('productName'),
            dataIndex: 'productName',
            width: '300px',
            render: (_: any, __: any, index: number) => {
                return <>
                    <Form.Item hidden noStyle
                               name={[index, 'productId']}>
                        <Input/>
                    </Form.Item>
                    <span>{props.form.getFieldValue([detailsFieldName, index, 'productName'])}</span>
                </>
            },
        },
        {
            title: <>{t('lotNumber')} <span className='text-red'>*</span></>,
            dataIndex: 'lotNumber',
            width: '150px',
            render: (_: any, record: IQualityInspectionPrDto, index: number) => (
                <>
                    <Form.Item
                        hidden noStyle
                        name={[index, 'lotNumber']}>
                        <Input/>
                    </Form.Item>
                    {record.isProductUseLotNumber &&
                        <span>{props.form.getFieldValue([detailsFieldName, index, 'lotNumber'])}</span>}
                </>

            ),
        },
        {
            title: t('expiryDate'),
            dataIndex: 'expiryDate',
            width: '300px',
            render: (_: any, __: any, index: number) => {
                return <>
                    {_ && <DateCell date={_}></DateCell>}
                    <Form.Item hidden noStyle name={[index, 'expiryDate']}>
                        <OrdDateInput></OrdDateInput>
                    </Form.Item>
                </>
            },
        },
        {
            title: <>{t('qty')} <span className='text-red'>*</span></>,
            dataIndex: 'qty',
            width: '150px',
            render: (_: any, __: any, index: number) => (
                <Form.Item
                    name={[index, 'qty']}
                    rules={[{required: true, message: 'qty is required!'}]}
                    style={{margin: 0}}
                >
                    <InputNumber style={{width: '100%'}} min={0}/>
                </Form.Item>
            ),
        },
        {
            title: t('unitId'),
            dataIndex: 'unitId',
            width: '200px',
            render: (_: any, record: IQualityInspectionPrDto, index: number) => {
                return <>
                    <Form.Item
                        hidden
                        noStyle
                        name={[index, 'unitName']}
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        hidden
                        noStyle
                        name={[index, 'unitId']}
                    >
                        <InputNumber></InputNumber>
                    </Form.Item>
                    <RenderSelectPrUnit
                        prUnitId={record.unitId}
                        onChange={(val: string) => {
                            props.form.setFieldValue([detailsFieldName, index, 'unitId'], val)
                        }}
                        productId={record.productId}></RenderSelectPrUnit>
                </>
            }
        },
        {
            title: t('reason'),
            dataIndex: 'reason',
            width: '300px',
            render: (_: any, __: any, index: number) => {
                return <>
                    <Form.Item name={[index, 'reason']}>
                        <AutoComplete
                            placeholder={t('reason')}
                            options={optionsReason}
                        />
                    </Form.Item>
                </>
            },
        },
        {
            title: <>{t('remarks')} <span className='text-red'>*</span></>,
            dataIndex: 'remarks',
            width: '300px',
            render: (_: any, __: any, index: number) => {
                return <>
                    <Form.Item name={[index, 'remarks']}>
                        <AutoComplete
                            options={optionsRemarks}
                        />
                    </Form.Item>
                </>
            },
        },
        {
            title: t('actionPlan'),
            dataIndex: 'actionPlan',
            width: '300px',
            render: (_: any, __: any, index: number) => {
                return <>
                    <Form.Item name={[index, 'actionPlan']}>
                        <Input placeholder={t('actionPlan')}/>
                    </Form.Item>
                </>
            },
        },

        {
            title: t('action'),
            width: '30px',
            align: 'center',
            render: (_: any, __: any, index: number) => (
                <>
                    <Button className={'text-red'} onClick={() => {
                        handleRemoveRow(index);
                    }}>
                        <DeleteOutlined></DeleteOutlined>
                    </Button>
                </>
            ),
        },
    ];
    const addRowRef = useRef<(defaultValue?: Partial<IQualityInspectionPrDto>) => void | undefined>();
    const removeRowRef = useRef<(index: number) => void | undefined>();
    const handleRemoveRow = (index: number) => {
        if (removeRowRef.current) {
            removeRowRef.current(index);
        }
    };
    return (<div className='grid-product-item-container'>
            {!props.disable && <SearchProduct onProductSelected={handlerProductSelect}
                                              onlyGetProductUsingInventory={Form.useWatch('type', props.form) == 2} //Phiếu nhập thì chỉ get sản phẩm có quán lý tồn kho
                                              onMultiSelected={handlerMultiProductSelect}/>}
            <Form className='mt-2' form={props.form} disabled={props.disable}>
                <FormList name={detailsFieldName}>
                    {(fields, {add, remove}) => {
                        addRowRef.current = add;
                        removeRowRef.current = remove;
                        return <Table<IQualityInspectionPrDto>
                            dataSource={fields.map((field, index) => {
                                return {
                                    ...props.form.getFieldValue([detailsFieldName, index]),
                                    rowKey: "" + field.key,
                                }
                            })}
                            columns={columns as ColumnTypes}
                            pagination={false}
                            rowKey={(d) => `${d.rowKey}`}
                        />
                    }}
                </FormList>
            </Form>
        </div>
    )
}
export default GridProductItems;
