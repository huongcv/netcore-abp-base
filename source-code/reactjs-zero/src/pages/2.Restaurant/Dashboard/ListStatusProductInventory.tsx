import {
    Badge,
    Button,
    Card,
    Dropdown,
    MenuProps,
    Segmented,
    SegmentedProps,
    Space,
    Spin,
    Table,
    TableColumnsType
} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DashboardService} from "@api/DashboardService";
import {DataWarningProductStatusDto, ProductInventoryStatus, WarningExpiryProductDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import DateUtil from "@ord-core/utils/date.util";
import {observer} from "mobx-react-lite";
import UiUtils from "@ord-core/utils/ui.utils";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {l} from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";
import dashboardStore from "@ord-store/Dashboard/dashboardStore";
import {DownOutlined, ExportOutlined, ImportOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {ExcelIcon} from "@ord-components/icon/ExcelIcon";
import {ArrowRightIcon} from "@ord-components/icon/ArrowRightIcon";
import ReportStockCommodityExpiryStore from "@ord-store/Report/ReportStockCommodityExpiryStore";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

const ListStatusProductInventory = () => {
    const {t} = useTranslation('dashboard');
    const [dataCount, setDataCount] = useState<WarningExpiryProductDto | undefined>();
    const [dataTable, setDataTable] = useState<any>([]);
    const [selectedValue, setSelectedValue] = useState(1);
    const [loading, setLoading] = useState(true);
    const {
        dashboard,
        reportStockCommodityExpiryStore: reportStockCommodityExpiryStore
    } = useStore();
    const {t: t2} = useTranslation(reportStockCommodityExpiryStore.getNamespaceLocale());

    const {warningData: warningData} = dashboard;

    const segmentedOnChange = async (value: ProductInventoryStatus) => {
        setSelectedValue(value);
        try {
            const responseSoonExpiry = await DashboardService.getListStatusProductInInventory({
                body: {
                    listType: value,
                    maxResultCount: 10,
                    skipCount: 0
                }
            });
            setDataTable(responseSoonExpiry.items);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        dashboard.getCountStatusProduct().then();
        segmentedOnChange(1).then();
    }, []);

    const options: SegmentedProps<ProductInventoryStatus>['options'] = [
        {
            label: <p
                className={selectedValue === 1 ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabSoonExpiry')}
                <Badge
                    className={'ml-2 w-10'}
                    showZero
                    count={warningData?.countWarningExpiry}
                    style={selectedValue === 1 ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: 1
        },
        {
            label: <p
                className={selectedValue === 2 ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabExpiried')}
                <Badge
                    className={'ml-2 w-10 box-0'}
                    showZero
                    count={warningData?.countExpiried}
                    style={selectedValue === 2 ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: 2
        },
        {
            label: <p
                className={selectedValue === 3 ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabOutOfStock')}
                <Badge
                    className={'ml-2 w-10 box-0'}
                    showZero
                    count={warningData?.countOutOfStock}
                    style={selectedValue === 3 ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: 3
        }
    ]
    const columns: TableColumnsType<DataWarningProductStatusDto> = [
        {
            title: 'STT',
            dataIndex: 'STT',
            width: 70,
            align: "center",
            render: (text, dto, index) => {
                return <p>{index + 1}</p>
            }
        },
        {
            title: t('productName'),
            dataIndex: 'productName',
            render: (text) => <TextLineClampDisplay content={text}/> 
        },
        {
            hidden: selectedValue === 3,
            title: t('lotNumber'),
            dataIndex: 'lotNumber',
            align: "center",
        },
        {
            title: t('qty'),
            dataIndex: 'qty',
            align: "center",
        },
        {
            hidden: selectedValue !== 3,
            title: t('basicUnitName'),
            dataIndex: 'basicUnitName',
            align: "center",
        },
        {
            hidden: selectedValue === 3,
            title: t('expiryDate'),
            dataIndex: 'expiryDate',
            align: "center",
            render: v => (DateUtil.toFormat(v, 'DD/MM/YYYY')),
        },
        {
            hidden: selectedValue === 3,
            title: selectedValue === 2 ? t('outOfDate') : t('restOfDays'),
            dataIndex: 'restOfDays',
            align: "center",
            render: (text) => {
                return (<>{Math.abs(text) + t('days')}</>)
            },
        },
    ];

    const exportItems: MenuProps['items'] = [
        {

            label: <a onClick={() => {
                reportStockCommodityExpiryStore.exportReportForDashboard(
                    t('dsSapHetHan'), t('fileExcel.sapHetHan'), 2)
                    .then(res => {

                    })
                // dashboard.exportExcelProductInventoryStatus(1).then()
            }} type={'text'}>
                <Space>
                    <ExportOutlined/>
                    {t('dsSapHetHan')}
                </Space>
            </a>,
            key: '0',
        },
        {
            label: <a onClick={() => {
                reportStockCommodityExpiryStore.exportReportForDashboard(
                    t('dsDaHetHan'), t('fileExcel.daHetHan'), 3)
                    .then(res => {

                    })
            }} type={'text'}>
                <Space>
                    <ExportOutlined/>
                    {t('dsDaHetHan')}
                </Space>
            </a>,
            key: '1',
        },
        {
            label: <a onClick={() => dashboard.exportProductOutOfStock().then()} type={'text'}>
                <Space>
                    <ExportOutlined/>
                    {t('dsSapHetHang')}
                </Space>
            </a>,
            key: '2',
        }
    ];
    const exportExcel = () => {
        if(selectedValue===1){
            reportStockCommodityExpiryStore.exportReportForDashboard(
                t('dsSapHetHan'), t('fileExcel.sapHetHan'), 2)
                .then(res => {

                })
        }else if(selectedValue===2){
            reportStockCommodityExpiryStore.exportReportForDashboard(
                t('dsDaHetHan'), t('fileExcel.daHetHan'), 3)
                .then(res => {

                })
        } else if(selectedValue===3){
            dashboard.exportProductOutOfStock().then()
        }
    }

    return <Card className={'h-full'} title={
        <p className={'title-card-default mt-4'}>{t('waringExpiryTitle')}</p>
    } extra={
        <Button className={'btn-secondary'} onClick={exportExcel}>
            <Space.Compact className="flex gap-2">
                <ExcelIcon/>
                {t('exportExcel')}
            </Space.Compact>
        </Button>
    }
    >
        {
            loading ? (<div className={'w-full flex justify-center'}><Spin></Spin></div>) :
                <div>
                    <Segmented
                        defaultValue={1}
                        className={'p-1 w-full'}
                        style={{marginBottom: 8, color: "black"}}
                        onChange={(value: ProductInventoryStatus) => segmentedOnChange(value)}
                        options={options}
                        block
                    />
                    <Table<DataWarningProductStatusDto> dataSource={dataTable} columns={columns}/>
                </div>

        }
    </Card>

};

export default observer(ListStatusProductInventory);
