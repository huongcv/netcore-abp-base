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

export  enum PRODUCT_INVENTORY_STATUS {
    SAP_HET_HAN = 1,
    DA_HET_HAN = 2,
    SAP_HET_HANG = 3,
}

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
        segmentedOnChange(PRODUCT_INVENTORY_STATUS.SAP_HET_HANG).then();
    }, []);

    const options: SegmentedProps<ProductInventoryStatus>['options'] = [
        {
            label: <p
                className={selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HANG ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabOutOfStock')}
                <Badge
                    className={'ml-2 w-10 box-0'}
                    showZero
                    count={warningData?.countOutOfStock}
                    style={selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HANG ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: PRODUCT_INVENTORY_STATUS.SAP_HET_HANG
        },
        {
            label: <p
                className={selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HAN ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabSoonExpiry')}
                <Badge
                    className={'ml-2 w-10'}
                    showZero
                    count={warningData?.countWarningExpiry}
                    style={selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HAN ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: PRODUCT_INVENTORY_STATUS.SAP_HET_HAN
        },
        {
            label: <p
                className={selectedValue === PRODUCT_INVENTORY_STATUS.DA_HET_HAN ? 'tab-badge text-primary-active' : 'tab-badge'}>{t('titleTabExpiried')}
                <Badge
                    className={'ml-2 w-10 box-0'}
                    showZero
                    count={warningData?.countExpiried}
                    style={selectedValue === PRODUCT_INVENTORY_STATUS.DA_HET_HAN ? {backgroundColor: '#F38F1F', boxShadow: "none"}
                        : {backgroundColor: '#D0D0D0', color: 'black', boxShadow: "none"}}
                />
            </p>,
            value: PRODUCT_INVENTORY_STATUS.DA_HET_HAN
        },
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
            render: (text, dto) => {
                return (<>{dto.productCode} - {dto.productName}</>)
            },
            render: (text) => <TextLineClampDisplay content={text}/>
        },
        {
            hidden: selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HANG,
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
            hidden: selectedValue !== PRODUCT_INVENTORY_STATUS.SAP_HET_HANG,
            title: t('basicUnitName'),
            dataIndex: 'basicUnitName',
            align: "center",
        },
        {
            hidden: selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HANG,
            title: t('expiryDate'),
            dataIndex: 'expiryDate',
            align: "center",
            render: v => (DateUtil.toFormat(v, 'DD/MM/YYYY')),
        },
        {
            hidden: selectedValue === PRODUCT_INVENTORY_STATUS.SAP_HET_HANG,
            title: selectedValue === PRODUCT_INVENTORY_STATUS.DA_HET_HAN ? t('outOfDate') : t('restOfDays'),
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
                    t('dsSapHetHan'), t('fileExcel.sapHetHan'), PRODUCT_INVENTORY_STATUS.DA_HET_HAN)
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
                    t('dsDaHetHan'), t('fileExcel.daHetHan'), PRODUCT_INVENTORY_STATUS.SAP_HET_HANG)
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
        if(selectedValue===PRODUCT_INVENTORY_STATUS.SAP_HET_HAN){
            reportStockCommodityExpiryStore.exportReportForDashboard(
                t('dsSapHetHan'), t('fileExcel.sapHetHan'), PRODUCT_INVENTORY_STATUS.DA_HET_HAN)
                .then(res => {

                })
        }else if(selectedValue===PRODUCT_INVENTORY_STATUS.DA_HET_HAN){
            reportStockCommodityExpiryStore.exportReportForDashboard(
                t('dsDaHetHan'), t('fileExcel.daHetHan'), PRODUCT_INVENTORY_STATUS.SAP_HET_HANG)
                .then(res => {

                })
        } else if(selectedValue===PRODUCT_INVENTORY_STATUS.SAP_HET_HANG){
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
                        defaultValue={PRODUCT_INVENTORY_STATUS.SAP_HET_HANG}
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

