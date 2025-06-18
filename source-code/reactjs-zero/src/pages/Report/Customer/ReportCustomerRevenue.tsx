import React, {useEffect} from "react";
import {useStore} from "@ord-store/index";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useTranslation} from "react-i18next";
import DateUtil from "@ord-core/utils/date.util";
import {CustomerRevenueReportDto} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {observer} from "mobx-react-lite";
import {TableProps} from "antd/es/table/InternalTable";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {OrdBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

function ReportCustomerRevenue() {
    const {customerReportStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const {t:tRe} = useTranslation('report');
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            searchFormRef.setFields([
                {
                    name:"rangeDate",
                    value:DateUtil.getDateRange('thang_nay')
                }
            ])
            stored.setSearchFormRef(searchFormRef);
            stored.loadSummary();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'customerCode',
            title: 'customerCode',
            align: 'center',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <strong>{record.customerCode}</strong>
            }
        },
        {
            dataIndex: 'customerName',
            title: 'customerName',
            width: 200,
            align: 'center',
        },
        {

            title: 'totalPurchase',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber(record.totalPurchase, 0)}
                </>
            },
        },
        {
            title: 'totalDiscount',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber(record.totalDiscount, 0)}
                </>
            },
        },
        {

            title: 'totalVAT',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber(record.totalVAT, 0)}
                </>
            },
        },
        {

            title: 'totalPayment',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber(record.totalPayment, 0)}
                </>
            },
        },
        {
            dataIndex: 'totalPayAgain',
            title: 'totalPayAgain',
            align: 'right',
            width: 180,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber(record.totalPayAgain, 0)}
                </>
            },

        },

        {
            dataIndex: 'totalDebt',
            title: 'totalDebt',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <>
                    {formatterNumber((record.totalDebt ?? 0) , 0)}
                </>
            },

        },
        {
            dataIndex: 'totalRevenue',
            title: 'totalRevenue',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDto) => {
                return <strong>
                    {formatterNumber(record.totalRevenue, 0)}
                </strong>
            },

        },

    ], {
        ns: stored.getNamespaceLocale()
    });
    const navigate = useNavigate();

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name:"rangeDate",
                value:DateUtil.getDateRange('thang_nay')
            }
        ])
        stored.searchData({});
        stored.loadSummary();
    }

    const topAction: IActionBtn[] = [
        {
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined/>
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
        {
            content: <Button type='primary' onClick={() => {
                stored.exportExcelPagedResult()
                    .then(res => {

                    })
            }}>
                <Space>
                    <ExportOutlined/>
                </Space>
                {t('actionBtn.exportExcel')}
            </Button>
        }
    ]
    const {summaryData} = stored;

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('titlePage')}
                                   items={[t('titlePageLvl1'), t('titlePageLvl2')]}>
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                  onFinish={debounce((d) => {
                      stored.searchData(d);
                      stored.loadSummary();
                  }, 250)}>
                <Row gutter={16}>
                    <Col lg={8} md={12}>
                        <FloatLabel label={t('rangeDate')}>
                            <Form.Item>
                                <Space.Compact style={{width: '100%'}}>
                                    <Form.Item name='rangeDate' className='flex-auto'>
                                        <OrdDateRangeInput></OrdDateRangeInput>
                                    </Form.Item>
                                    <Button type='default' onClick={onResetClick} className={'btn-other'} icon={<IconlyLight width={22} type={'Reload.svg'}/>} />
                                </Space.Compact>

                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'}/>} />
                </Row>
            </Form>
            <div className="ord-container-box">
                <AntTableWithDataPaged
                    searchForm={searchFormRef}
                    getPageResult={(d) => {
                        return stored.apiService().getPaged({
                            body: {
                                ...d.body
                            }
                        }, {})
                    }}
                    columns={columns}
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed='top'>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align='left'>
                                        <strong className=''>{t('total')}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPurchase, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalDiscount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalVAT, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={10} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber((summaryData?.totalPayment ?? 0), 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={11} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPayAgain, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={12} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber((summaryData?.totalDebt ?? 0) , 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={13} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalRevenue, 0)}
                                    </Table.Summary.Cell>

                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>

        </>
    );
}

export default observer(ReportCustomerRevenue);
