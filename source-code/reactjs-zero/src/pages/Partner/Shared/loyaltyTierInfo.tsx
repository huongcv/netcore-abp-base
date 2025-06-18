import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Col, Form, Row, Space, TableColumnsType } from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

export const LoyaltyTierInfo = observer((prop: {
    partnerId: number,
}) => {
    const { t } = useTranslation(['customer']);
    const [fromSeach] = Form.useForm();

    const {partnerLoyaltyTierStore: stored} = useStore(); 

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'upgradeDay',
            dataIndex: 'upgradeDay',
            render: v => v ? (DateUtil.toFormat(v)) : "",
            width: 200,
            sorter: false
        },
        {
            title: 'upgradeNotes',
            dataIndex: 'notes',
            width: 200,
            sorter: false
        },
  
    ], {
        actions: [],
        ns: 'customer'
    });
    const onResetClick = () => {
        fromSeach.resetFields();
    }

    return (<>
        <Form form={fromSeach} layout={'vertical'}
            onFinish={debounce((d) => {
                stored.searchData(d)
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
                    return stored.apiService().getPaged({
                        body: {
                            ...d.body,
                            partnerId: prop.partnerId
                        }
                    }, {})
                }}
                columns={columns}
                searchData={stored.searchDataState}
                refreshDatasource={stored.refreshDataState}
            />}

        </div>
    </>);
})
