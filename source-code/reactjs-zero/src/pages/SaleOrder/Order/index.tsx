import {
    ExportOutlined,
    TikTokOutlined
} from "@ant-design/icons";
import { SaleInvoiceDto, SaleInvoiceGetListDto, SaleOrderDto } from "@api/index.defs";
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
import { Button, Dropdown, Form, MenuProps, Space, TableColumnsType } from "antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import OrderStatusDisplay from "@pages/2.Restaurant/Order/Utils/OrderStatusDisplay";
import { ORDER_STATUS_ENUM } from "./Utils/Util";
import { SaleOrderService } from "@api/SaleOrderService";
import { SaleOrderStatusSegmented } from "./Utils/SaleOrderStatusSegmented";

export const SaleOrder = () => {
    const { saleOrderStore: mainStore, einvoiceStore: eStore } = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-order');
    const { t: tEnum } = useTranslation('enum');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchFormRef] = Form.useForm();
    const navigate = useNavigate();
    // @ts-ignore
    const invoiceSelect = (item: SaleInvoiceDto) => {
        openDetailForm(item);
    }


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
                render: (v, data: SaleOrderDto) => (
                    <div style={{ display: "flex", justifyContent: 'center' }}>
                        <OrderStatusDisplay status={data.status as ORDER_STATUS_ENUM} />
                    </div>
                ),
                width: 130,
            }
        ],
        {
            actions: [
                {
                    title: 'edit',
                    onClick: (record: SaleOrderDto) => {
                        navigate('update/' + record.idHash);
                        console.log(record, "record")
                    },
                },
            ] as ITableAction<SaleInvoiceDto>[],
            // viewAction: (d) => {
            //     openDetailForm(d);
            // },
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
        },
        {
            title: 'addNew',
            // permission: PERMISSION_APP.human.employee + '.Create',
            onClick: () => {
                navigate('add-new');
            }
        }
    ];

    const openDetailForm = (d: SaleInvoiceDto) => {
        // @ts-ignore
        setIsModalVisible(true);
    }


    return (<>
        <OrdCrudPage
            topActions={topActions}
            stored={mainStore}
            columns={columns}
            searchForm={(f) => <InvoiceSearch onlyThreeMonthsFilter={true} />}
            contentTopTable={<SaleOrderStatusSegmented ns={mainStore.getNamespaceLocale()}
                getCountApi={SaleOrderService.getCount} />}
        ></OrdCrudPage>

    </>)

}
export default observer(SaleOrder);