import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import {EmployeeProductReportDto} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import Utils from "@ord-core/utils/utils";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";

import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { IconlyLight } from "@ord-components/icon/IconlyLight";


function ReportCustomerProduct() {
    const {employeeReportProduct: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    const productTypeCombo = useSelectProductType();
    
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
            dataIndex: 'employeeName',
            title: 'employeeName',
            width: 150,
        },
        {
            dataIndex: 'productName',
            title: 'productName',
            width: 200,
            align: 'center',
            render: (text) => <TextLineClampDisplay content={text}/> 
        },
        {
            dataIndex: 'purchaseProduct',
            title: 'purchaseProduct',
            align: 'right',
            width: 150,
        },
        {

            title: 'totalPurchase',
            align: 'right',
            width: 150,
            render: (data: string, record: EmployeeProductReportDto) => {
                return <>
                    {formatterNumber(record.totalPurchase, 0)}
                </>
            },
        },
        {
            dataIndex: 'payAgainProduct',
            title: 'payAgainProduct',
            align: 'right',
            width: 150,
        },
        {
            dataIndex: 'totalPayAgain',
            title: 'totalPayAgain',
            align: 'right',
            width: 180,
            render: (data: string, record: EmployeeProductReportDto) => {
                return <>
                    {formatterNumber(record.totalPayAgain, 0)}
                </>
            },

        },

        {
            dataIndex: 'totalRevenue',
            title: 'totalRevenue',
            align: 'right',
            width: 150,
            render: (data: string, record: EmployeeProductReportDto) => {
                return <>
                    {formatterNumber(record.totalRevenue, 0)}
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
        stored.loadSummary()
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
                    <Col {...useResponsiveSpan(6)}>
                        <FloatLabel label={t("type")}>
                            <Form.Item name="productTypeId">
                                <OrdSelect allowClear datasource={productTypeCombo}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col lg={12} md={12}>
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
                                    <Table.Summary.Cell index={1} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {summaryData?.purchaseProduct}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPurchase, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {summaryData?.payAgainProduct}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalPayAgain, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={5} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {formatterNumber(summaryData?.totalRevenue, 0)}
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

export default observer(ReportCustomerProduct);
