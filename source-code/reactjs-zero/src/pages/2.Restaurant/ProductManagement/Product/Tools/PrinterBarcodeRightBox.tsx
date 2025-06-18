import {BarcodeProductItemDto, ProductBarCodeLayoutSettingDto} from "@api/index.defs";
import {Button, Checkbox, Form, InputNumber, Radio, Segmented, Select, Space, Table, Tooltip} from "antd";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {DeleteOutlined} from "@ant-design/icons";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {ColumnType} from "antd/es/table/interface";

export const layoutSettingFieldName = (name: string) => {
    return [layoutSettingField, name];
}

export const detailsFieldName = "products";
export const layoutSettingField = "layoutSetting";
const PrinterBarcodeRightBox = (props: {
    barcodeLayoutItems: ProductBarCodeLayoutSettingDto[]
}) => {
    const form = Form.useFormInstance();
    const printerType_w = Form.useWatch('printerType', form);
    const {t} = useTranslation('product');
    const {productListPrintBarCode} = useStore();
    const {selectedRows: dataSource} = productListPrintBarCode;
    const isPrintPriceWithTax_w = Form.useWatch(layoutSettingFieldName('isPrintPriceWithTax'), form);
    const pageIndexRef = useRef<number>(1);
    const pageSize = 5;

    const handleChangeUnit = (value: any, item: any, key: string, data: BarcodeProductItemDto) => {
        form.setFieldValue([detailsFieldName, key, 'productUnitId'], value)
        data.productUnitId = value;

        form.setFieldValue([detailsFieldName, key, 'unitName'], item.label?.trim())
        data.unitName = item.label?.trim();

        form.setFieldValue([detailsFieldName, key, 'barCode'], item.data?.barCode || '');
        data.barCode = item.data?.barCode || '';

        const price = (isPrintPriceWithTax_w ? item.data.priceWithTax : item.data.price) || 0;
        form.setFieldValue([detailsFieldName, key, 'price'], price)
        data.price = price;
    }

    const handleChangeQtyPrint = (value: number | null, data: BarcodeProductItemDto) => {
        value = value || 1;
        form.setFieldValue([detailsFieldName, !data?.id + '', 'qtyPrint'], value);
        data.qtyPrint = value;
    }

    const columns: ColumnType<BarcodeProductItemDto>[] = [
        {
            title: t('stt'),
            dataIndex: 'stt',
            width: '50px',
            align: 'center',
            render: (_: any, __: BarcodeProductItemDto, index: number) =>
                <span>{(pageSize * (pageIndexRef.current - 1)) + index + 1}</span>
        },
        {
            title: t('name'),
            dataIndex: 'productName',
            width: '200px',
            render: (_: any, __: BarcodeProductItemDto) => <>
                <TextLineClampDisplay content={_}></TextLineClampDisplay>
                <Form.Item
                    hidden
                    initialValue={__.productName}
                    name={[detailsFieldName, __.id! + '', 'productName']}
                    style={{margin: 0}}
                >
                </Form.Item>
            </>
        },
        {
            title: t('unitName2'),
            width: '120px',
            render: (_: any, __: BarcodeProductItemDto) => {
                return <>
                    <Form.Item
                        name={[detailsFieldName, __.id! + '', 'productUnitId']}
                        rules={[ValidateUtils.required]}
                        style={{margin: 0}}
                        initialValue={+__.productUnitId!}
                    >
                        <Select
                            defaultValue={+__.productUnitId!}
                            className='w-full'
                            onChange={(value, option) => {
                                handleChangeUnit(value, option, __.id! + '', __)
                            }}
                            options={__.units?.map(x => ({
                                value: x.id,
                                label: x.unitName,
                                data: x
                            }))}
                        />
                    </Form.Item>
                    <Form.Item hidden name={[detailsFieldName, __.id! + '', 'unitName']}
                               initialValue={__.unitName}></Form.Item>
                    <Form.Item hidden name={[detailsFieldName, __.id! + '', 'units']}
                               initialValue={__.units}></Form.Item>
                </>

            }
        },
        {
            title: t('price'),
            dataIndex: 'priceWithTax',
            width: '150px',
            render: (_: any, __: BarcodeProductItemDto) => {
                const price = form.getFieldValue([detailsFieldName, __.id! + '', 'price']);

                return <>
                    <PriceCell value={price}/>
                    <Form.Item
                        hidden
                        initialValue={__.price}
                        name={[detailsFieldName, __.id! + '', 'price']}
                        style={{margin: 0}}
                    >
                    </Form.Item>
                </>
            }
        },
        {
            title: t('barCode'),
            dataIndex: 'barCode',
            width: '100px',
            render: (_: any, __: BarcodeProductItemDto) => {
                const barCode = form.getFieldValue([detailsFieldName, __.id! + '', 'barCode']);

                return <>
                    <TextLineClampDisplay content={barCode}></TextLineClampDisplay>
                    <Form.Item
                        hidden
                        initialValue={__.barCode}
                        name={[detailsFieldName, __.id! + '', 'barCode']}
                        style={{margin: 0}}
                    >
                    </Form.Item>
                </>
            }
        },
        {
            title: t('qty'),
            dataIndex: 'qtyPrint',
            width: '100px',
            render: (_: any, __: BarcodeProductItemDto) => {
                return <Form.Item
                    name={[detailsFieldName, __.id! + '', 'qtyPrint']}
                    rules={[ValidateUtils.required]}
                    style={{margin: 0}}
                    initialValue={__.qtyPrint || 1}
                >
                    <InputNumber onChange={(e) => handleChangeQtyPrint(e, __)} max={2_000} min={0}
                                 style={{width: '100%'}}/>
                </Form.Item>
            }
        },
        {
            title: '',
            width: '30px',
            align: 'center',
            render: (_: any, __: BarcodeProductItemDto) => (
                <>
                    <Button className={'text-red'} onClick={() => {
                        productListPrintBarCode.remove(__.id)
                    }}>
                        <DeleteOutlined></DeleteOutlined>
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        const f =
            props.barcodeLayoutItems.find(x => x.layoutType == printerType_w);

        form.setFieldValue(layoutSettingField, f);
    }, [printerType_w]);

    useEffect(() => {
        const items = productListPrintBarCode.selectedRows || [];
        items?.forEach((item: any) => {
            const unit = item.units.find((x: any) => x.id == item.productUnitId);
            const price = (isPrintPriceWithTax_w ? unit?.priceWithTax : unit?.price) || 0
            form.setFieldValue([detailsFieldName, item.id, 'price'], price);
            item.price = price;
        })

    }, [isPrintPriceWithTax_w]);

    return (<div className='grid-product-item-container'>
            <h3 className={'font-bold text-xl mb-3'}>{t('listSelected')}</h3>
            <strong className='mr-1.5'>{t('barcodeInfo')}: </strong>
            <div className='flex flex-row align-center item-center'>
                <Form.Item name={layoutSettingFieldName('isShowProductName')}
                           valuePropName='checked'
                           initialValue={true}>
                    <Checkbox>{t('barCodeSetting.IsShowProductName')}</Checkbox>
                </Form.Item>

                <Form.Item
                    className='ml-3'
                    name={layoutSettingFieldName('isShowArrayPriceUnit')}>
                    <Radio.Group>
                        <Tooltip title={t('barCodeSetting.IsShowPriceDesc')}>
                            <Radio value={false}>{t('barCodeSetting.IsShowPrice')}</Radio>
                        </Tooltip>
                        <Tooltip title={t('barCodeSetting.isShowArrayPriceDesc')}>
                            <Radio value={true}>{t('barCodeSetting.isShowArrayPrice')}</Radio>
                        </Tooltip>
                    </Radio.Group>
                </Form.Item>

                <Form.Item className='ml-3' name={layoutSettingFieldName('isPrintPriceWithTax')}
                           valuePropName='checked'>
                    <Checkbox>{t('barCodeSetting.productPriceWithTax')}</Checkbox>
                </Form.Item>
            </div>
            <Space wrap>
                <Form.Item name={'printerType'}>
                    <Segmented
                        options={props.barcodeLayoutItems.map(it => {
                            return {
                                value: it.layoutType,
                                label: t('printBarcodeTpl.' + it.layoutType),
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item hidden noStyle name={layoutSettingField}/>
            </Space>

            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                        pageIndexRef.current = page;
                    },
                }}
            />
        </div>
    )
};
export default PrinterBarcodeRightBox;
