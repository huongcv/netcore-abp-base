import {
    CopyOutlined,
    ExportOutlined,
    FileProtectOutlined,
    PrinterOutlined,
    StopOutlined,
    TikTokOutlined
} from "@ant-design/icons";
import { InvoiceStatusPagedCountDto, SaleInvoiceDto, SaleInvoiceGetListDto } from "@api/index.defs";
import { SaleInvoiceService } from "@api/SaleInvoiceService";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { ArrowRightIcon } from "@ord-components/icon/ArrowRightIcon";
import { ExcelIcon } from "@ord-components/icon/ExcelIcon";
import { LazadaIcon } from "@ord-components/icon/LazadaIcon";
import { SendoIcon } from "@ord-components/icon/SendoIcon";
import { ShoppeIcon } from "@ord-components/icon/ShoppeIcon";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { InvoiceSearch } from "@pages/SalesInvoice/Invoice/invoiceSearch";
import { InvoiceStatusSegmented } from "@pages/SalesInvoice/Invoice/invoiceStatusSegmented";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
import { Button, Dropdown, MenuProps, Space, TableColumnsType } from "antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OrderDetailForm } from "./detail";
import {format} from "date-fns";

export const List = () => {
    const { saleInvoiceStore: mainStore, einvoiceStore: eStore } = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const { t: tEnum } = useTranslation('enum');
    const [isModalVisible, setIsModalVisible] = useState(false);

    // @ts-ignore
    const invoiceSelect = (item: SaleInvoiceDto) => {
        openDetailForm(item);
    }

    const maskText = (text?: string): string => {
        if(!text) {
            return "";
        }
        if(text.length < 3) {
            return "**"; 
        }
        return `${text[0]}${'*'.repeat(text.length - 2)}${text[text.length - 1]}`;
    };

    const getRandomName = () => {
        const firstNames = ["Nguyen", "Tran", "Le", "Pham", "Hoang", "Dang", "Bui", "Do", "Ngo", "Duong"];
        const middleNames = ["Van", "Thi", "Huu", "Quoc", "Minh", "Dinh", "Thanh", "Ngoc", "Anh"];
        const lastNames = ["An", "Binh", "Chien", "Duc", "Hung", "Khanh", "Lam", "Nghia", "Quyen", "Son"];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        const fullName = `${firstName} ${middleName} ${lastName}`;

        return maskText(fullName);
    };

    const getRandomStatus = () => {
        const statuses = [
            { key: 4 }
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };

    const generateRandomOrder = (index: number) => {
        const status = getRandomStatus();
        return {
            orderCode: `OD${(10000 + index).toString().padStart(5, '0')}`,
            orderDate: new Date(2025, 2, 24, 10, 50 + index),
            partnerName: getRandomName(),
            saleChannelOrderName: 'Shoppe',
            totalAmount: Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000,
            status: status.key
        };
    };

    const defaultOrder = {
        orderCode: "OD10000",
        orderDate: new Date(2025, 2, 24, 10, 50),
        partnerName: maskText("Trần Thị Hương"),
        saleChannelOrderName: "Shoppe",
        totalAmount: 89000,
        status: 4
    };

    const dataSource = [defaultOrder, ...Array.from({ length: 9 }, (_, i) => generateRandomOrder(i + 1))];

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: 'orderCode',
                dataIndex: 'orderCode',
                width: 100,
                align: 'left',
                render: (text, dto) => {
                    return (<>
                        <a className="font-semibold underline" onClick={() => invoiceSelect(dto)}>{text}</a>
                    </>)
                }
            },
            {
                dataIndex: 'orderDate',
                title: 'orderDate',
                width: 140,
                align: 'center',
                render: v => format(v, "dd/MM/yyyy HH:mm"),
            },
            {
                title: 'partnerName',
                dataIndex: 'partnerName',
                align: 'left',
                ellipsis: true,
                width: 200,
                render(value, record, index): React.ReactNode {
                    return (
                        <div className="max-w-xl text-ellipsis overflow-hidden">
                            {value}
                        </div>
                    );
                },
            },
            {
                dataIndex: 'totalAmount',
                title: 'productAmount',
                align: 'end',
                render: v => (<PriceCell value={v} />),
                width: 130,
            },
            {
                dataIndex: 'saleChannelOrderName',
                title: 'source',
                render: v => {
                    if (v == 'Lazada') {
                        return <div className="flex items-center gap-1" ><LazadaIcon /> {v}</div>
                    } else if (v == 'Shoppe') {
                        return <div className="flex items-center gap-1" ><ShoppeIcon /> {v}</div>
                    } else if (v == 'Sendo') {
                        return <div className="flex items-center gap-1" ><SendoIcon /> {v}</div>
                    } else if (v == 'TikTok') {
                        return <div className="flex items-center gap-1"><TikTokOutlined /> {v}</div>
                    }
                    return <>{v}</>
                },
                width: 130,
            },
            {
                dataIndex: 'status',
                title: 'status',
                align: 'center',
                render: (v, data: SaleInvoiceDto) => (
                    <div style={{ display: "flex", justifyContent: 'center' }}>
                        <SaleInvoiceStatusCell status={v} />
                    </div>
                ),
                width: 130,
            }
        ],
        {
            actions: [
                {
                    title: 'edit',
                    hiddenIf: () => true,
                },
            ] as ITableAction<SaleInvoiceDto>[],
            viewAction: (d) => {
                openDetailForm(d);
            },
            ns: mainStore.getNamespaceLocale()
        });

    const exportItems: MenuProps['items'] = [
        {
            label: <a type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('actionBtn.exportExcel')}
                </Space>
            </a>,
            key: '1',
        },
        {
            label: <a type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('exportExcelDetail')}
                </Space>
            </a>,
            key: '2',
        }
    ];

    const topActions: IActionBtn[] = [
        {
            permission: 'SaleInvoice.Invoice',
            content: <Dropdown className={'btn-secondary'} menu={{ items: exportItems }} trigger={['hover']}>
                <Button>
                    <Space.Compact className="flex gap-2">
                        <ExcelIcon />
                        {tCommon('actionBtn.actionExcel')}
                        <ArrowRightIcon className="rotate-90" />
                    </Space.Compact>
                </Button>
            </Dropdown>
        }
    ];

    const openDetailForm = (d: SaleInvoiceDto) => {
        // @ts-ignore
        setIsModalVisible(true);
    }

    const fakeCountApi = (params: { body?: SaleInvoiceGetListDto }): Promise<any[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { status: null, totalCount: 10 },
                    { status: 4, totalCount: 10 },
                    { status: 1, totalCount: 0 },
                    { status: 3, totalCount: 0 }
                ]);
            }, 500); // Giả lập độ trễ API 500ms
        });
    };

    return (<>
        <OrdCrudPage stored={mainStore}
            topActions={topActions}
            columns={columns}
            searchForm={(f) => <InvoiceSearch onlyThreeMonthsFilter={true} />}
            entityForm={form => null}
            dataSource={dataSource}
            contentTopTable={<InvoiceStatusSegmented getCountApi={fakeCountApi} />}
        ></OrdCrudPage>
        <OrderDetailForm isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}
        />
    </>)
}
