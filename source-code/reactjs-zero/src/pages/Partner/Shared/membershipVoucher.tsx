import React from 'react';
import {Col, Form, Row, Space, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import {debounce} from "lodash";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

export const MembershipVoucher = observer((prop: {
    partnerId: number;
    disable?: boolean;
}) => {
    // const {t: tCommon} = useTranslation('common');
    const [fromSeach] = Form.useForm();
    const {membershipVoucherStore: mainStore} = useStore();
    const {t} = useTranslation([mainStore.getNamespaceLocale()]);

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'voucherType',
            dataIndex: 'voucherType',

        },
        {
            title: 'voucherCode',
            dataIndex: 'voucherCode',
        },
        {
            title: 'voucherName',
            dataIndex: 'voucherName',
        },
        {
            title: 'expirationDate',
            dataIndex: 'expirationDate',
        },
        {
            width: "70px",
            title: 'view',
            dataIndex: 'view',
        },
    ], {
        actions: [],
        ns: mainStore.getNamespaceLocale()
    });
    const onResetClick = () => {
        fromSeach.resetFields();
        mainStore.refreshGridData(true).then()
    }

    return (<>
        <Form form={fromSeach} layout={'vertical'}
              onFinish={debounce((d) => {
                  mainStore.searchData(d)
              }, 250)} disabled={prop.disable}>
            <Row gutter={16}>

                <Col {...useResponsiveSpan(9)}>
                    <FloatLabel label={t('rangeDate')}>
                        <Space.Compact style={{width: '100%'}}>
                            <Form.Item name='rangeDate' className='flex-auto'>
                                <OrdDateRangeInput allowEq></OrdDateRangeInput>
                            </Form.Item>
                        </Space.Compact>
                    </FloatLabel>
                </Col>
                <SearchFilterText
                    ignoreAutoFocus={true}
                    onReset={onResetClick} span={15}></SearchFilterText>
            </Row>
        </Form>
        <div style={{minHeight: 250}}>
            <AntTableWithDataPaged searchForm={fromSeach}

                                   getPageResult={(d) => {
                                       console.log("d", d);
                                       return mainStore.apiService().getPaged({
                                           body: {
                                               ...d.body,
                                               partnerId: prop.partnerId
                                           }
                                       }, {})
                                   }}
                                   columns={columns}
                                   searchData={mainStore.searchDataState}
                                   refreshDatasource={mainStore.refreshDataState}
            />
        </div>
    </>);
})
