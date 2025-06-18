import React, {memo, useEffect, useMemo} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Row, Space, Table, TableColumnsType} from "antd";
import DateUtil from "@ord-core/utils/date.util";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ArrowLeftOutlined, ExportOutlined} from "@ant-design/icons";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {debounce} from "lodash";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import TableUtil from "@ord-core/utils/table.util";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";
import {observer} from "mobx-react-lite";
import {ProductBookReportDto} from "@api/index.defs";
import {NumericFormat} from "react-number-format";
import {useSelectProduct} from "@ord-components/forms/select/selectDataSource/useSelectProduct";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import FloatLabel from "@ord-components/forms/FloatLabel";
import './ProductBook.scss';
import {useNavigate} from "react-router";

const PriceProductBook = ({value}: { value: any }) => {
    return <NumericFormat
        value={value}
        displayType={"text"}
        thousandSeparator={true}
    />
}

const ProductBook = () => {
    const {productBookStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tReport} = useTranslation('report');
    const [searchFormRef] = Form.useForm();
    const productCombo = useSelectProduct();
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
            <PageTopTitleAndAction usingCustom={true} items={["Báo cáo Hộ kinh doanh"]} mainTitle={tReport('ReportShop.BusinessHouseHold.ProductBook')}>
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
                    <Col span={6}>
                        <FloatLabel label={'Chọn sản phẩm'}>
                            <Form.Item name='listProductId' className='flex-auto'>
                                <OrdSelect mode='multiple' maxTagCount={1} placeholder='Chọn sản phẩm' datasource={productCombo}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <SearchFilterText
                        placeHolder={t('placeHolderSearchProductBook')}
                        onReset={onResetClick}
                        span={10}></SearchFilterText>
                </Row>
            </Form>

            <ProductBookTale/>
        </>
    );
};

export default ProductBook;

const ProductBookTale = memo(observer(() => {
    const {productBookStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());

    const columns: TableColumnsType<any> = useMemo(() => TableUtil.getColumns([
        {
            title: t('documentDate'),
            dataIndex: 'documentDate',
            width: 150
        },
        {
            title: t('documentNumber'),
            dataIndex: 'documentNumber',
            width: 120
        },
        {
            title: t('note2'),
            dataIndex: 'productName',
            width: 250,
            render: (text) => <TextLineClampDisplay className='font-semibold' content={text}/>
        },
        {
            title: t('unitName2'),
            dataIndex: 'basicUnitName',
            width: 120
        },
        {
            title: t('price'),
            dataIndex: 'costPrice',
            width: 120,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            title: t('import'),
            children: [
                {
                    title: t('qty'),
                    dataIndex: t('importQty'),
                    align: 'right',
                    width: 100,
                    render: (text) => <PriceProductBook value={text}/>
                },
                {
                    title: t('amount'),
                    dataIndex: 'importAmount',
                    align: 'right',
                    width: 150,
                    render: (text) => <PriceProductBook value={text}/>
                },
            ],
        },
        {
            title: t('export'),
            children: [
                {
                    title: t('qty'),
                    dataIndex: 'exportQty',
                    align: 'right',
                    width: 100,
                    render: (text) => <PriceProductBook value={text}/>
                },
                {
                    title: t('amount'),
                    dataIndex: 'exportAmount',
                    align: 'right',
                    width: 150,
                    render: (text) => <PriceProductBook value={text}/>
                },
            ],
        },
        {
            title: t('inventory'),
            children: [
                {
                    title: t('qty'),
                    dataIndex: 'inventoryQty',
                    align: 'right',
                    width: 100,
                    render: (text) => <PriceProductBook value={text}/>
                },
                {
                    title: t('amount'),
                    dataIndex: 'inventoryAmount',
                    align: 'right',
                    width: 150,
                    render: (text) => <PriceProductBook value={text}/>
                },
            ],
        }
    ]), []);

    const childColumns = useMemo(() => [
        {
            dataIndex: 'index',
            key: 'index',
            width: 60
        },
        {
            dataIndex: 'moveDateStr',
            key: 'moveDateStr',
            width: 150
        },
        {
            dataIndex: 'moveCode',
            key: 'moveCode',
            width: 120
        },
        {
            dataIndex: 'note',
            key: 'note',
            width: 250
        },
        {
            dataIndex: 'unitName',
            key: 'unitName',
            width: 120
        },
        {
            dataIndex: 'costPrice',
            key: 'costPrice',
            width: 120,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'importQty',
            key: 'importQty',
            width: 100,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'importAmount',
            key: 'importAmount',
            width: 150,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'exportQty',
            key: 'exportQty',
            width: 100,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'exportAmount',
            key: 'exportAmount',
            width: 150,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'inventoryQty',
            key: 'inventoryQty',
            width: 100,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
        {
            dataIndex: 'inventoryAmount',
            key: 'inventoryAmount',
            width: 150,
            align: 'right',
            render: (text) => <PriceProductBook value={text}/>
        },
    ], []);

    return <div className="ord-container-box">
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
            expandable={{
                expandedRowRender: (record: ProductBookReportDto) => (
                    <Table
                        className="nested-table-custom"
                        showHeader={false}
                        dataSource={record.details}
                        columns={childColumns}
                        pagination={false}
                    />
                ),
                rowExpandable: (record: ProductBookReportDto) => record.details && record.details.length > 0,
            }}
            searchForm={mainStore.searchFormRef}
            columns={columns}
            searchData={mainStore.searchDataState}
            refreshDatasource={mainStore.refreshDataState}
        >
        </AntTableWithDataPaged>
    </div>
}));

