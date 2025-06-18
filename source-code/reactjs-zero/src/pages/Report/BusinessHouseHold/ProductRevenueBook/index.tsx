import React, {memo, useEffect, useMemo} from 'react';
import {NumericFormat} from "react-number-format";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Button, Col, Form, Row, Space, TableColumnsType} from "antd";
import {ArrowLeftOutlined, ExportOutlined} from "@ant-design/icons";
import DateUtil from "@ord-core/utils/date.util";
import {TopAction} from "@ord-components/crud/TopAction";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {debounce} from "lodash";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {observer} from "mobx-react-lite";
import TableUtil from "@ord-core/utils/table.util";
import {ProductRevenueBookDto, ProductRevenueGroupDto} from "@api/index.defs";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useNavigate} from "react-router";

const PriceRevenueBook = ({value}: { value: any }) => {
    return <NumericFormat
        value={value}
        displayType={"text"}
        thousandSeparator={true}
    />
}

const Index = () => {
    const {productRevenueBookStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tReport} = useTranslation('report');
    const [searchFormRef] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (mainStore) {
            mainStore.setSearchFormRef(searchFormRef);
            searchFormRef.setFields([
                {
                    name: "rangeDate",
                    value: DateUtil.getDateRange('thang_nay')
                },
            ])
        }
    }, []);

    const topActions: IActionBtn[] = [
        {
            content: (
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t("returnList", { ns: "common" })}
                </Button>
            ),
        },
        {
            content: <Button type='primary' onClick={() => {
                mainStore.exportExcelPagedResult().then();
            }}>
                <Space>
                    <ExportOutlined/>
                </Space>
                {t('actionBtn.exportExcel')}
            </Button>
        },
    ];

    function onResetClick() {
        searchFormRef.resetFields();
        searchFormRef.setFields([
            {
                name: "rangeDate",
                value: DateUtil.getDateRange('thang_nay')
            }
        ])
        mainStore.searchData({})
    }

    return (
        <>
            <PageTopTitleAndAction usingCustom={true} items={["Báo cáo Hộ kinh doanh"]}
                                   mainTitle={tReport('ReportShop.BusinessHouseHold.ProductRevenueBook')}>
                <TopAction topActions={topActions}/>
            </PageTopTitleAndAction>

            <Form className={'ord-container-box'} form={searchFormRef} layout={"vertical"}
                  onFinish={debounce((d) => {
                      mainStore.searchData(d);
                  }, 250)}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name='rangeDate' className='flex-auto'>
                            <OrdDateRangeInput allowClear={false} allowEq labelMode={"fromToLabel"}></OrdDateRangeInput>
                        </Form.Item>
                    </Col>
                    <SearchFilterText
                        placeHolder={t('placeHolderSearchProductRevenueBook')}
                        onReset={onResetClick}
                        span={10}></SearchFilterText>
                </Row>
            </Form>

            <ProductBookTale />
        </>
    );
};

export default Index;

const ProductBookTale = memo(observer(() => {
    const {productRevenueBookStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());

    const columns: TableColumnsType<any> = useMemo(() => TableUtil.getColumns([
        {
            title: t('saleInvoice'),
            dataIndex: 'saleInvoiceCode',
            children: [
                {
                    title: t('saleInvoiceCode'),
                    dataIndex: 'saleInvoiceCode',
                    width: 150,
                    ...alignCell2 as any,
                },
                {
                    title: t('saleInvoiceDate'),
                    dataIndex: 'saleInvoiceDateStr',
                    width: 150,
                    ...alignCell as any,
                },
            ]
        },
        {
            title: t('notes'),
            dataIndex: 'notes',
            width: 200,
            ...alignCell2 as any,
        },
        {
            title: t('distribution'),
            children: [
                {
                    title: t('distribution1'),
                    dataIndex: 'distribution',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.distribution!.totalAmount}/>
                },
                {
                    title: t('distribution2'),
                    dataIndex: 'distribution2',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.distribution2!.totalAmount}/>
                },
            ]
        },
        {
            title: t('services'),
            children: [
                {
                    title: t('services1'),
                    dataIndex: 'services',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.services!.totalAmount}/>
                },
                {
                    title: t('services2'),
                    dataIndex: 'services2',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.services2!.totalAmount}/>
                },
                {
                    title: t('services3'),
                    dataIndex: 'services3',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.services3!.totalAmount}/>
                },
                {
                    title: t('services4'),
                    dataIndex: 'services4',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.services4!.totalAmount}/>
                },
            ]
        },
        {
            title: t('transportation'),
            children: [
                {
                    title: t('transportation1'),
                    dataIndex: 'transportation',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.transportation!.totalAmount}/>
                },
                {
                    title: t('transportation2'),
                    dataIndex: 'transportation2',
                    width: 200,
                    ...alignCell as any,
                    render: (_, dto: ProductRevenueBookDto) => <PriceRevenueBook value={dto.transportation2!.totalAmount}/>
                },
            ]
        },
    ]), []);

    return <>
        <AntTableWithDataPaged
            getPageResult={(d) => {
                return mainStore.apiService().getPaged({
                    body: {
                        ...d.body
                    }
                }, {})

            }}
            onChangePageResult={(d) => {
                if (mainStore) {
                    mainStore.setPageResult(d);
                }
            }}
            searchForm={mainStore.searchFormRef}
            columns={columns}
            searchData={mainStore.searchDataState}
            refreshDatasource={mainStore.refreshDataState}
        >
        </AntTableWithDataPaged>
    </>
}))

const alignCell = {
    onHeaderCell: () => ({
        style: { textAlign: 'center' }
    }),
    onCell: () => ({
        style: { textAlign: 'right' }
    }),
}

const alignCell2 = {
    onHeaderCell: () => ({
        style: { textAlign: 'center' }
    }),
    onCell: () => ({
        style: { textAlign: 'left' }
    }),
}