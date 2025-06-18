import { DeleteOutlined } from "@ant-design/icons";
import { PartnerDto, PartnerTransactionDto } from "@api/index.defs";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import { Button, Col, Form, Row, Space, TableColumnsType } from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

export const CustomerPayinfo = observer((prop: {
    partnerId: number,
    partnerInfo: PartnerDto,
    store: CommonListStore<any>,
    debtStore: CommonListStore<any>,
    useHotKey?: boolean,
    type: number,
}) => {
    const { t } = useTranslation(['partner_transaction']);
    const { t: tEnum } = useTranslation(['enum']);
    const [fromSeach] = Form.useForm();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    })

    const { store, useHotKey, debtStore, type } = prop;
    const debtTicketType = type === 1
        ? 113
        : 114;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'transactionDate',
            dataIndex: 'transactionDate',
            render: (v: string, record: PartnerTransactionDto) => {
                return <>
                    {DateUtil.toFormat(v, 'DD/MM/YYYY HH:mm')}
                </>;
            },
            width: 200,
        },
        {
            title: 'transactionCode',
            dataIndex: 'transactionCode',
          width: 200,
        },
        {
            title: 'transactionType',
            dataIndex: 'strTransactionType',
            render: (v: string) => {
                return <>
                    {t(v)}
                </>;
            },
            width: 200,
        },
        {
            title: 'creatorShopName',
            dataIndex: 'creatorShopName',
            render: (v: string) => {
                return <>
                    {<TextLineClampDisplay content={v} className={'!font-medium'}/>}
                </>;
            },
            width: 200,        
        },
        {
            title: 'amount',
            dataIndex: 'amount',
            align: 'right',
            width: 250,
            render: (v: number) => {
                return <>
                    <span className={
                        v >= 0 ? 'text-green-600' : ''
                    }>
                        {v ? formatter.format(v) : '0'}
                    </span>
                </>;
            },
        },
        {
            title: 'outstanding',
            dataIndex: 'debtAmount',
            align: 'right',
            width: 250,
            render: (v: number) => {
                return <>
                    {v ? formatter.format(v) : '0'}
                </>;
            },
        },
        // {
        //     title: 'action',
        //     dataIndex: 'debt',
        //     align: 'right',
        //     width: 100,
        //     render: (v: any, transaction: any) => {
        //         return transaction.transactionType === debtTicketType ? (
        //             <Space>
        //                 <Button
        //                     className="!w-7 !h-7 !min-w-0 flex items-center justify-center"
        //                     shape="circle"
        //                     danger
        //                     icon={<DeleteOutlined />}
        //                     onClick={() => {
        //                         uiUtils.showConfirm({
        //                             title: t('confirmRemoveTicketTitle'),
        //                             content: (
        //                                 <div>{t('confirmRemoveTicket')}</div>
        //                             ),
        //                             icon: "remove",
        //                             isDanger: true,
        //                             onOk: async () => {
        //                                 console.log(debtStore.apiService());
        //                                 // @ts-ignore
        //                                 const result = await debtStore.apiService().remove({
        //                                     removeId: transaction.id
        //                                 }).then();
        //                                 if (result.isSuccessful) {
        //                                     uiUtils.showSuccess(t('removeTiketSuccessful'));
        //                                     store.refreshGridData().then();
        //                                 } else {
        //                                     uiUtils.showError(t(result.notification as any));
        //                                 }
        //                             }
        //                         })
        //                     }}
        //                 />
        //             </Space>
        //         ) : <></>;
        //     }
        // },
    ], {
        actions: [],
        ns: 'partner_transaction'
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
                                <OrdDateRangeInput allowEq notAllowFuture></OrdDateRangeInput>
                            </Form.Item>
                        </Space.Compact>
                    </FloatLabel>
                </Col>
                <SearchFilterText ignoreAutoFocus={true} onReset={onResetClick} span={15} placeHolder={t('textSearch')}></SearchFilterText>
            </Row>
        </Form>
        <div style={{ minHeight: 250 }}>
            {prop.partnerId != null && <AntTableWithDataPaged searchForm={fromSeach}
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
