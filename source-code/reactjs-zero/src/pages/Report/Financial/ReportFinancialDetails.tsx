import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import DateUtil from "@ord-core/utils/date.util";
import {useNavigate} from "react-router-dom";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ArrowLeftOutlined, ExportOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {observer} from "mobx-react-lite";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {FinancialReportData} from "@ord-store/Report/FinancialReportStore";
import Utils from "@ord-core/utils/utils";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

function ReportFinancialDetails() {
    const {financialReportStore: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const [searchFormRef] = Form.useForm();
    useEffect(() => {
        if (stored) {
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange('thang_nay')
                }
            ])
            stored.setSearchFormRef(searchFormRef);
            stored.loadReport();
        }
    }, []);
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<FinancialReportData> = [
        {
            dataIndex: 'order',
            title: t('order'),
            width: 50
        },
        {
            dataIndex: 'name',
            title: t('name'),
            width: 700,
            render: (data: string, record) => {
                return <>
                    {record.children && record.children?.length > 0 ? <span className='uppercase'>{data}</span> :
                        <span>{data}</span>} </>
            }
        },
        {
            dataIndex: 'formula',
            title: t('formula'),
            width: 100
        },
        {
            dataIndex: 'totalAmount',
            title: t('totalAmount'),
            align: 'right',
            width: 150,
            render: (data: string, record) => {
                return <>
                    {record.children && record.children?.length > 0 ?
                        <span className='text-red font-bold'>{formatterNumber(record.totalAmount, 0)}</span> :
                        <span>{formatterNumber(record.totalAmount, 0)}</span>} </>
            },
        },

    ];
    const navigate = useNavigate();

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ])
        stored.loadReport();
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
                stored.exportExcelPagedResultExt()
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

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('titlePage')}
                                   items={[t('titlePageLvl1')]}>
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                  onFinish={debounce((d) => {
                      stored.loadReport(d);
                  }, 250)}>
                <Row gutter={16}>
                    <Col lg={8} md={12}>
                        <FloatLabel label={t('rangeDate')}>
                            <Form.Item>
                                <Space.Compact style={{width: '100%'}}>
                                    <Form.Item name='rangeDate' className='flex-auto'>
                                        <OrdDateRangeInput allowEq ></OrdDateRangeInput>
                                    </Form.Item>
                                    <Button type='default' onClick={onResetClick} className={'btn-other'} icon={<IconlyLight width={22} type={'Reload.svg'}/>} />
                                </Space.Compact>

                            </Form.Item>
                        </FloatLabel>

                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'}/>} />
                </Row>
            </Form>
            <div className='ord-container-box'>
                <Table<FinancialReportData>
                    columns={columns}
                    dataSource={stored.dataSource}
                    rowKey="key"
                    bordered={false}
                    scroll={{x: 'max-content'}}
                    sticky={{offsetHeader: 1}}
                    pagination={false}/>
            </div>
        </>
    );
}

export default observer(ReportFinancialDetails);
