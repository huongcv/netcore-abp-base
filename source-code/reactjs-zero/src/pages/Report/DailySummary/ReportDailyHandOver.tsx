import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Card, Col, Divider, Flex, Form, Input, Row, Space, Tabs, TabsProps} from "antd";
import {useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, ExportOutlined, PrinterOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {useStore} from "@ord-store/index";
import {debounce} from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {observer} from "mobx-react-lite";
import {NumericFormat} from "react-number-format";
import {ShopWorkShiftDto} from "@api/index.defs";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import {DailySummaryIncomeReportService} from "@api/DailySummaryIncomeReportService";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {PrintInvoice} from "@pages/SalesInvoice/Utils/printInvoice";
import { IconlyLight } from "@ord-components/icon/IconlyLight";

const ReportDailyHandOver = () => {
    const [searchFormRef] = Form.useForm();
    const {reportDailyHandOverStore: store} = useStore()
    const {t} = useTranslation(store.getNamespaceLocale());
    useEffect(() => {
        if (store) {
            searchFormRef.setFields([
                {
                    name: 'creationTime',
                    value: new Date()
                },
                {
                    name: 'creatorEmployeeId',
                    value: undefined
                }
            ])
            store.loadDataSource({startDate: new Date()});
        }
    }, []);

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "creationTime",
                value: new Date(),
            },
            {
                name: 'creatorEmployeeId',
                value: undefined
            }
        ])
        store.loadDataSource({startDate: new Date()});
    }

    const navigate = useNavigate();
    const topAction = [
        {
            title: t('actionBtn.ReasonType'),
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined/>
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },

    ]
    const [itemsTab, setItemsTab] = useState<TabsProps['items']>([]);
    useEffect(() => {

        setItemsTab(store.dataSource.map((x, idx) => {
            return {
                label: t('shift', {name:  x.name}),
                key: idx.toString(),
                children: <ShiftRevenueDetail shopWorkShiftId={x.id ? parseInt(x.id) : 0}/>,
            }
        }))
    }, [store.dataSource]);

    const ShiftRevenueDetail = (props: {
        shopWorkShiftId: number
    }) => {
        const [summary, setSummary] = useState<ShopWorkShiftDto>();

        const differenceAmount = () => {
            return (summary?.closingCash ?? 0) - (summary?.openingCash ?? 0);
        }


        useEffect(() => {
            getSummary(props.shopWorkShiftId)
        }, [props.shopWorkShiftId]);

        const getSummary = (id: number) => {
            DailySummaryIncomeReportService.getHandOverById({
                workShiftId: id
            }).then(data => {
                setSummary(data);
            })
        }
        const [pdfUrl, setPdfUrl] = React.useState("");
        const printPdf = async () => {
            UiUtils.setBusy();
            try {
                const resultBlob = await ShopWorkShiftService.printPdfById({
                    findId: props.shopWorkShiftId
                }, {responseType: 'blob'});
                setPdfUrl(URL.createObjectURL(resultBlob));

            } catch (error) {
                console.error('API call failed:', error);
            } finally {
                UiUtils.clearBusy();
            }
        };

        return (
            <>
                <div className="w-full grid grid-cols-3 gap-3">
                    <Card title="Thu chi khác" size="small" className="h-[100%]">
                        <Space direction="vertical" className="w-full">
                            <Flex>
                                <span>Tổng thu</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span><NumericFormat value={summary?.otherReceiptAmount} displayType={'text'}
                                                     thousandSeparator={true}/> đ</span>
                            </Flex>
                            <Flex>
                                <span>Tổng chi</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span><NumericFormat value={summary?.otherPaymentAmount} displayType={'text'}
                                                     thousandSeparator={true}/> đ</span>
                            </Flex>
                            <Flex>
                                <span>Công nợ</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span>0 đ</span>
                            </Flex>
                        </Space>
                    </Card>
                    <div className="flex flex-col">
                        <Card title="Bán hàng" size="small">
                            <Space direction="vertical" className="w-full">
                                <Flex>
                                    <span>Số lượng</span>
                                    <span
                                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                    <span>{summary?.returnInvoiceQty}</span>
                                </Flex>
                                <Flex>
                                    <span>Giá trị</span>
                                    <span
                                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                    <span><NumericFormat value={summary?.returnInvoiceAmount} displayType={'text'}
                                                         thousandSeparator={true}/> đ</span>
                                </Flex>
                            </Space>
                        </Card>
                        <Card title="Hàng trả" size="small" className="mt-3">
                            <Space direction="vertical" className="w-full">
                                <Flex>
                                    <span>Số lượng</span>
                                    <span
                                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                    <span><NumericFormat value={summary?.returnInvoiceQty} displayType={'text'}
                                                         thousandSeparator={true}/></span>
                                </Flex>
                                <Flex>
                                    <span>Giá trị</span>
                                    <span
                                        className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                    <span><NumericFormat value={summary?.returnInvoiceAmount} displayType={'text'}
                                                         thousandSeparator={true}/> đ</span>
                                </Flex>
                            </Space>
                        </Card>                       
                    </div>
                    <Card title="Bàn giao tiền" size="small">

                        <Space direction={'vertical'} style={{width: '100%'}}> </Space>
                        <Space direction={'vertical'} style={{width: '100%'}}> </Space>

                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <Flex>
                                <span>{t('openingEmployeeName')}</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <strong>{summary?.openingEmployeeName}</strong>
                            </Flex>
                            <Flex>
                                <span>{t('shiftTime')}</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span>{DateUtil.toFormat(summary?.startDate, 'HH:mm')} - {DateUtil.toFormat(summary?.endDate, 'HH:mm DD/MM/YYYY')}</span>
                            </Flex>
                            <Flex>
                                <span>{t('openingCash')}</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span><NumericFormat value={summary?.openingCash} displayType={'text'}
                                                     thousandSeparator={true}/> đ</span>
                            </Flex>
                            <Flex>
                                <span>{t('closingCash')}</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span><NumericFormat value={summary?.closingCash} displayType={'text'}
                                                     thousandSeparator={true}/> đ</span>
                            </Flex>
                            <Flex>
                                <span>Chênh lệch</span>
                                <span
                                    className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                                <span><NumericFormat value={differenceAmount()} displayType={'text'}
                                                     thousandSeparator={true}/> đ</span>
                            </Flex>
                        </Space>
                        <Divider className="mt-5"/>


                        <Flex>
                            <span>{t('closingEmployeeName')}</span>
                            <span
                                className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                            <strong>{summary?.closingEmployeeName}</strong>
                        </Flex>
                        <Flex>
                            <span>{t('notes')}</span>
                            <span
                                className="mb-[5px] border-b-[1px] border-dashed border-b-emerald-200 flex-1"></span>
                            <span>{summary?.notes}</span>
                        </Flex>

                        <div className='text-right mt-2'>
                            <Button htmlType='button' type='primary' onClick={() => printPdf().then()}>
                                <PrinterOutlined></PrinterOutlined>
                                {t('actionBtn.print')}
                            </Button>
                        </div>
                    </Card>
                </div>

                <PrintInvoice pdfUrl={pdfUrl}/>
            </>

        )
    }


    return (
        <div>
            <PageTopTitleAndAction usingCustom={true} mainTitle={t('titlePage')}
                                   items={[t('titlePageLvl1'), t('titlePageLvl2')]}>
                <TopAction topActions={topAction}/>
            </PageTopTitleAndAction>
            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                  onFinish={debounce((d) => {
                      store.loadDataSource({
                          startDate: d.creationTime,
                      });
                  }, 250)}>
                <Row gutter={16}>

                    <Col lg={6} md={12}>
                        <FloatLabel label={t('creationTime')}>
                                <Space.Compact style={{width: '100%'}}>
                                    <Form.Item name='creationTime' className='flex-auto'>
                                        <OrdDateInput></OrdDateInput>
                                    </Form.Item>
                                    <Button type='default' onClick={onResetClick} className={'btn-other'} icon={<IconlyLight width={22} type={'Reload.svg'}/>}></Button>
                                </Space.Compact>
                        </FloatLabel>

                    </Col>
                    <Button type='primary' htmlType={'submit'} className={'search-btn'} icon={<IconlyLight width={22} type={'Search.svg'}/>}></Button>
                </Row>
            </Form>
            <div className='ord-container-box'>
                <Tabs defaultValue="0" type='card' items={itemsTab}>

                </Tabs>
            </div>


        </div>
    );
};


export default observer(ReportDailyHandOver);