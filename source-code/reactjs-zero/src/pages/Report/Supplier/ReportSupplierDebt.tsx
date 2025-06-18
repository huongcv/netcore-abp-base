import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import {CustomerDebtReportDto} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

function ReportSupplierDebt() {
    const {supplierDebtReportStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            stored.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange('thang_nay')
                }
            ])
            stored.loadSummary();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'customerCode',
            title: 'customerCode',
            align: 'left',
            width: 150,
        },
        {
            dataIndex: 'customerName',
            title: 'customerName',
            width: 200,
            align: 'left',
        },
        {
            title: 'beginingDebtPeriod',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerDebtReportDto) => {
                return <>
                    {formatterNumber(record.beginingDebtPeriod, 0)}
                </>
            },
        },
        {

            title: 'totalPurchase',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerDebtReportDto) => {
                return <>
                    {formatterNumber(record.totalPurchase, 0)}
                </>
            },
        },

        {

            title: 'totalPayment',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerDebtReportDto) => {
                return <>
                    {formatterNumber(record.totalPayment, 0)}
                </>
            },
        },
        {
            dataIndex: 'duringDebtPeriod',
            title: 'duringDebtPeriod',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerDebtReportDto) => {
                return <>
                    {formatterNumber(record.duringDebtPeriod, 0)}
                </>
            },

        },
        {
            dataIndex: 'endingDebtPeriod',
            title: 'endingDebtPeriod',
            align: 'right',
            width: 150,
            render: (data: string, record: CustomerDebtReportDto) => {
                return <>
                    {formatterNumber(record.endingDebtPeriod, 0)}
                </>
            },

        }

    ], {
        ns: stored.getNamespaceLocale()
    });
    const navigate = useNavigate();

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
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
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed='top'>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align='left'>
                                        <strong className=''>{t('total')}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.beginingDebtPeriod, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPurchase, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPayment, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.duringDebtPeriod, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={10} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.endingDebtPeriod, 0)}
                                    </Table.Summary.Cell>

                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                    columns={columns}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>

        </>
    );
}

export default observer(ReportSupplierDebt);
