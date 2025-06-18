import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType, TableProps} from "antd";
import React, {useEffect} from "react";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import {SupplierProductReportDto} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import DateCell from "@ord-components/table/cells/DateCell";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

function ReportSupplierImport() {
    const {supplierReportImport: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            stored.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name:"rangeDate",
                    value:DateUtil.getDateRange('thang_nay')
                }
            ])
            stored.loadSummary();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'transactionDate',
            title: 'transactionDate',
            width: 200,
            align: 'center',
            render: (_) => <DateCell date={_} format="DD/MM/YYYY HH:mm"></DateCell>,
        },
        {
            dataIndex: 'supplierName',
            title: 'supplierName',
            width: 200,
        },
        {
            dataIndex: 'supplierCode',
            title: 'supplierCode',
            align: 'center',
            width: 150,
        },
        {
            dataIndex: 'productName',
            title: 'productName',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text}/>,
        },
        {
            dataIndex: 'productCode',
            title: 'productCode',
            align: 'center',
            width: 150
        },
        {
            dataIndex: 'lotNumber',
            title: 'lotNumber',
            align: 'center',
            width: 100
        },
        {
            dataIndex: 'expiryDate',
            title: 'expiryDate',
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {record.expiryDate ? DateUtil.toFormat(record.expiryDate, 'DD/MM/YYYY')
                        : ""}
                </>
            },
            width: 150
        },
        {
            dataIndex: 'unitName',
            title: 'unitName',
            width: 80
        },
        {

            title: 'price',
            align: 'right',
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {formatterNumber(record.price, 0)}
                </>
            },
            width: 150
        },
        {
            dataIndex: 'moveQty',
            title: 'moveQty',
            align: 'right',
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {formatterNumber(record.moveQty, 0)}
                </>
            },
            width: 100,
        },
        {
            dataIndex: 'totalAmount',
            title: 'totalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {formatterNumber(record.totalAmount, 0)}
                </>
            },

        },
        {
            dataIndex: 'returnQty',
            title: 'returnQty',
            align: 'right',
            width: 100,
        },
        {
            dataIndex: 'returnTotalAmount',
            title: 'returnTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {formatterNumber(record.returnTotalAmount, 0)}
                </>
            },
        },
        {
            dataIndex: 'totalMove',
            title: 'totalMove',
            align: 'right',
            width: 150,
            render: (data: string, record: SupplierProductReportDto) => {
                return <>
                    {formatterNumber(record.totalMove, 0)}
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
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed='top'>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={10} align='left'>
                                        <strong className=''>{t('total')}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.moveQty ?? 0, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalAmount ?? 0, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.returnQty ?? 0, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.returnTotalAmount ?? 0, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalMove ?? 0, 0)}
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

export default observer(ReportSupplierImport);
