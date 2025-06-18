import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import React, {useEffect, useState} from "react";
import {ProductUnitDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table/interface";
import {RowIdxColumn} from "@ord-components/table/cells/RowIdxColumn";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {Form, Input, Row, Table} from "antd";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {observer} from "mobx-react-lite";

const ProductUnitTabContent = () => {
    const {t} = useTranslation('product');
    const {productImportExcelStore} = useStore();
    const [datasource, setdatasource] = useState<ProductUnitDto[]>([]);
    const columns: ColumnType<ProductUnitDto>[] = [
        RowIdxColumn,
        {
            title: t('unitName'),
            width: 250,
            dataIndex: 'unitName'
        },
        {
            title: t('convertRate'),
            width: 250,
            dataIndex: 'convertRate',
            render: (_) => {
                return <>
                    <span className={'me-1'}>{_}</span>
                    {
                        productImportExcelStore?.productDetail &&
                        <span className={'italic'}>{productImportExcelStore?.productDetail?.basicUnitName}</span>
                    }

                </>
            }
        },
        {
            title: t('price'),
            width: 250,
            dataIndex: 'price',
            render: (_) => {
                return <PriceCell value={_} fixed={0}></PriceCell>
            }
        },
        {
            title: t('barCode'),
            width: 250,
            dataIndex: 'barcode'
        },
    ];
    useEffect(() => {
        if (productImportExcelStore.productDetail) {
            setdatasource(productImportExcelStore?.productDetail?.unitItems || [])
        }
    }, [productImportExcelStore.productDetail]);
    return (<>
        <Row>
            <ColSpanResponsive span={6}>
                <FloatLabel label={t('BasicUnitName')}>
                    <Form.Item name='basicUnitName'>
                        <Input/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
        </Row>
        <Table className={'mb-3'}
            columns={columns}
            pagination={false}
            dataSource={datasource.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
    </>);
}
export default observer(ProductUnitTabContent);
