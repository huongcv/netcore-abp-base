import React from 'react';
import { Col, Form, Row, Space, TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useStore } from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import { PartnerTransactionDto } from "@api/index.defs";
import { debounce } from "lodash";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import DateUtil from "@ord-core/utils/date.util";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { CommonListStore } from '@ord-core/base/CommonListStore';

export const DebtInfo = observer((prop: {
    partnerId: number,
    store: CommonListStore<any>,
    type: number,
    useHotKey?: boolean;
}) => {
    const { t } = useTranslation(['partner_debt']);
    const [fromSeach] = Form.useForm();
    const { store, type, useHotKey } = prop;
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    })

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: type == 1 ? 'invoiceDate' : 'moveDate',
            dataIndex: type == 1 ? 'invoiceDate' : 'moveDate',
            render: v => v ? (DateUtil.toFormat(v)) : "",
            width: 200,
            sorter: false
        },
        {
            title: type == 1 ? 'invoiceCode' : 'moveCode',
            dataIndex: type == 1 ? 'invoiceCode' : 'moveCode',
            width: 200
        },
        {
            title: 'paymentAmount',
            dataIndex: 'paymentAmount',
            align: "right",
            minWidth: 120,
            render: (v: number) => {
                return <>
                    {v ? formatter.format(v) : '-'}
                </>;
            },
        },
        {
            title: 'debtAmount',
            dataIndex: 'debtAmount',
            align: "right",
            minWidth: 120,
            render: (v: number) => {
                return <>
                    {v ? formatter.format(v) : '-'}
                </>;
            },
        },
    ], {
        actions: [],
        ns: 'partner_debt'
    });
    const onResetClick = () => {
        fromSeach.resetFields();
        store.refreshGridData(true).then()
    }

    return (<>
        <Form form={fromSeach} layout={'vertical'}
            onFinish={debounce((d) => {
                store.searchData(d)
            }, 250)}>
            <Row gutter={16}>

                <Col {...useResponsiveSpan(9)}>
                    <FloatLabel label={t('rangeDate')}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Form.Item name='rangeDate' className='flex-auto'>
                                <OrdDateRangeInput allowEq></OrdDateRangeInput>
                            </Form.Item>
                        </Space.Compact>
                    </FloatLabel>
                </Col>
                <SearchFilterText
                    ignoreAutoFocus={true}
                    onReset={onResetClick} span={15} placeHolder={t('textSearch')}></SearchFilterText>
            </Row>
        </Form>
        <div style={{ minHeight: 250 }}>
            {prop.partnerId && <AntTableWithDataPaged searchForm={fromSeach}

                getPageResult={(d) => {
                    return store.apiService().getPaged({
                        body: {
                            ...d.body,
                            partnerId: prop.partnerId
                        }
                    }, {})
                }}
                columns={columns}
                searchData={store.searchDataState}
                refreshDatasource={store.refreshDataState}
            />}

        </div>
    </>);
})
