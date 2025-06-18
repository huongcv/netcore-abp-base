import {ProductSearchWithUnitDto, ShopTemplateDetailsDto} from "@api/index.defs";
import {Button, Form, FormInstance, InputNumber, Table} from "antd";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {TableProps} from "antd/es/table/InternalTable";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import SearchProduct from "@pages/System/ShopTemplate/Upsert/gridProduct/SearchProduct/SearchProduct";
import FormList from "antd/es/form/FormList";
import {DeleteOutlined} from "@ant-design/icons";

interface IShopTemplateDetailsDto extends ShopTemplateDetailsDto {
    rowKey: number
}

const detailsFieldName = "details";
type ColumnTypes = Exclude<TableProps<IShopTemplateDetailsDto>['columns'], undefined>;
const GridProductItems = (props: {
    form: FormInstance,
    disable: boolean | undefined
}) => {
    const {t} = useTranslation('shopTemplate');
    const {searchProductShopTplTableStore: searchProductStore} = useStore();

    useEffect(() => {
        props.form.setFieldValue(detailsFieldName, searchProductStore.selectedRows)
    }, [searchProductStore.selectedRows]);
    const handlerProductSelect = async (productSelected: ProductSearchWithUnitDto) => {
        if (addRowRef.current) {
            const details: IShopTemplateDetailsDto[] = props.form.getFieldValue(detailsFieldName);
            const indexFind = details.findIndex(x => x.productUnitId == productSelected.productUnitId);
            if (indexFind == -1) {
                const newKey = Math.random(); // Sinh key ngẫu nhiên
                addRowRef.current({
                    productUnitId: productSelected.productUnitId,
                    productName: productSelected.productName,
                    productCode: productSelected.productCode,
                    productId: productSelected.productId,
                    qty: 1,
                    rowKey: newKey
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
        prUnitId: string | undefined,
        productId: string | undefined,
        onChange: (value: any, option: IOrdSelectOption | IOrdSelectOption[]) => void;
    }) => {
        useEffect(() => {
            console.log("productIdChange", props.productId)
        }, [props.productId]);

        // return  <InputNumber></InputNumber>
        return <OrdSelect
            defaultValue={props.prUnitId}
            onChange={props.onChange}
            datasource={useSelectProductUnit(props.productId)}></OrdSelect>

        // return <OrdSelect datasource={useSelectProductUnit(props.productId)}></OrdSelect>
    }
    const getProductUnit = (productId: number) => {
        return useSelectProductUnit(productId)
    }
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
            width: '150px',
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
                    <span>{props.form.getFieldValue([detailsFieldName, index, 'productName'])}</span>
                </>
            },
        },
        {
            title: t('qty'),
            dataIndex: 'qty',
            width: '150px',
            render: (_: any, __: any, index: number) => (
                <Form.Item
                    name={[index, 'qty']}
                    rules={[{required: true, message: 'qty is required!'}]}
                    style={{margin: 0}}
                >
                    <InputNumber style={{width: '100%'}}/>
                </Form.Item>
            ),
        },
        {
            title: t('productUnitId'),
            dataIndex: 'productUnitId',
            width: '200px',
            render: (_: any, record: IShopTemplateDetailsDto, index: number) => {
                console.log("record", record)
                // return <RenderSelectPrUnit index={index} productId={record.productId}></RenderSelectPrUnit>
                // const options = getProductUnit(record.productId)
                return <>
                    <Form.Item
                        hidden
                        name={[index, 'productUnitId']}
                        style={{margin: 0}}
                    >
                        <InputNumber></InputNumber>
                    </Form.Item>
                    <RenderSelectPrUnit
                        prUnitId={record.productUnitId}
                        onChange={(val: string) => {
                            props.form.setFieldValue([detailsFieldName, index, 'productUnitId'], val)
                        }}
                        productId={record.productId}></RenderSelectPrUnit>
                </>
            }
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
    const addRowRef = useRef<(defaultValue?: Partial<IShopTemplateDetailsDto>) => void | undefined>();
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
            <Form form={props.form} disabled={props.disable}>
                <FormList name={detailsFieldName}>
                    {(fields, {add, remove}) => {
                        addRowRef.current = add;
                        removeRowRef.current = remove;
                        return <Table<IShopTemplateDetailsDto>
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
