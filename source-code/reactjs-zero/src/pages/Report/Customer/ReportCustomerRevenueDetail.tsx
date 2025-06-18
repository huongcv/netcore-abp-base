import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import {CustomerRevenueReportDetailDto} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
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

function ReportCustomerRevenueDetail() {
    const {customerReportDetailStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
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
    const formatterNumber =Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'invoiceDate',
            dataIndex: 'invoiceDate',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                {
                    record.children ?
                    '' :
                    DateUtil.toFormat(record.invoiceDate, 'DD/MM/YYYY HH:MM')
                }
                </>
            },
            sorter: false,
            align: "center"
        },
        {
            dataIndex: 'customerCode',
            title: 'customerCode',
            align: 'center',
            width: 150,
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    {
                        record.children ? <strong>{record.customerCode}</strong> : record.customerCode
                    }
                </>
            },
        },
        {
            dataIndex: 'customerName',
            title: 'customerName',
            width: 200,
            align: 'center',
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    {
                        record.children ? <strong>{record.customerName}</strong> : record.customerName
                    }
                </>
            },
        },
        {
            dataIndex: 'invoiceCode',
            title: 'invoiceCode',
            width: 200,
            align: 'center',
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    {
                        record.children ? <strong className={'text-primary'}>TỔNG SỐ: {record.invoiceAmount}</strong> : record.invoiceCode
                    }
                </>
            },
        },
        {

            title: 'totalPurchase',
            align: 'right',
            width: 200,
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    <p className={record.children ? 'font-bold' : ''}>
                        {formatterNumber(record.totalPurchase, 0)}
                    </p>
                </>
            },
        },
        {
                    title: 'totalDiscount',
                    align: 'right',
                    width: 150,
                    render: (data: string, record: CustomerRevenueReportDetailDto) => {
                        return <>
                            {formatterNumber(record.totalDiscount, 0)}
                        </>
                    },
                },
                {
        
                    title: 'totalVAT',
                    align: 'right',
                    width: 150,
                    render: (data: string, record: CustomerRevenueReportDetailDto) => {
                        return <>
                            {formatterNumber(record.totalVAT, 0)}
                        </>
                    },
                },
        {
            dataIndex: 'totalPayAgain',
            title: 'totalPayAgain',
            align: 'right',
            width: 200,
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    <p className={record.children ? 'font-bold' : ''}>
                        {formatterNumber(record.totalPayAgain, 0)}
                    </p>
                </>
            },

        },
        {
                    dataIndex: 'totalDebt',
                    title: 'totalDebt',
                    align: 'right',
                    width: 150,
                    render: (data: string, record: CustomerRevenueReportDetailDto) => {
                        return <>
                            {formatterNumber((record.totalDebt ?? 0) , 0)}
                        </>
                    },
        
                },
        {
            dataIndex: 'totalRevenue',
            title: 'totalRevenue',
            align: 'right',
            width: 200,
            render: (data: string, record: CustomerRevenueReportDetailDto) => {
                return <>
                    <p className={record.children ? 'font-bold' : ''}>
                        {formatterNumber(record.totalRevenue, 0)}
                    </p>
                </>
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
        },
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
                                    <Table.Summary.Cell index={0} colSpan={5} align='left'>
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
                                    <Table.Summary.Cell index={8} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalVAT, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPayAgain, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={10} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalDebt, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={11} align='right'
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

export default observer(ReportCustomerRevenueDetail);
