import React, {memo, useEffect, useState} from 'react';
import {useStore} from "@ord-store/index";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import {Search} from "@pages/2.Restaurant/Reservation";
import {Form, Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {OrderGetPagedDto} from "@api/index.defs";
import OrderStatusDisplay from "@pages/2.Restaurant/Order/Utils/OrderStatusDisplay";
import {useTranslation} from "react-i18next";
import DateUtil from "@ord-core/utils/date.util";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import '../index.scss'
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import UiUtils from "@ord-core/utils/ui.utils";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import CancelOrder from "@pages/2.Restaurant/Order/Utils/CancelOrder";
import {StopOutlined} from "@ant-design/icons";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {ORDER_STATUS_ENUM} from "@pages/2.Restaurant/Order/Utils/Util";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

type OrderListProps = {
    tableId?: number | undefined;
    setIsOpen?: (value: boolean) => void;
}

const Search = (props: OrderListProps) => {
    const {tableId} = props;
    const {t} = useTranslation("order");
    const initRange = DateUtil.getDateRange("thang_nay");
    return (
        <>
            <ColSpanResponsive span={8}>
                <Form.Item name="moveDateRange" initialValue={initRange}>
                    <OrdDateRangeInput allowEq labelMode={"fromToLabel"}/>
                </Form.Item>
            </ColSpanResponsive>
            <SearchFilterText
                span={16}
                iconSearchCustom={<IconlyLightSearch className='bg-white' width={44}/>}
                placeHolder={t("searchPlaceHolder")}
            />
            <Form.Item noStyle name='tableId' initialValue={tableId}/>
        </>
    );
};

const OrderList = (props: OrderListProps) => {
    const {tableId, setIsOpen} = props;
    const {t} = useTranslation('order');
    const {orderStore: mainStore} = useStore();
    const [record, setRecord] = useState<OrderGetPagedDto | null>(null);

    const columns: TableColumnsType<OrderGetPagedDto> = TableUtil.getColumns(
        [
            {
                title: "Mã đơn hàng",
                dataIndex: 'orderCode',
                width: 150,
            },
            {
                width: 150,
                title: "Khách hàng",
                dataIndex: "partnerName",
            },
            {
                width: 100,
                title: "Bàn",
                dataIndex: "tableName",
            },
            {
                width: 150,
                title: "Thời gian",
                dataIndex: "orderDateStr",
            },
            {
                width: 150,
                title: "Số món",
                dataIndex: "ordersCount",
            },
            {
                title: "Trạng thái",
                align: "center",
                width: 100,
                render: (_: any, record: OrderGetPagedDto) => (
                    <OrderStatusDisplay status={record.status!}/>
                ),
            },
        ],
        {
            actions: [
                {
                    title: 'view',
                    hiddenIf: () => true
                },
                {
                    title: 'cancel',
                    hiddenIf: (dto: OrderGetPagedDto) => dto.status === ORDER_STATUS_ENUM.DA_HUY,
                    icon: <Space wrap>
                        <StopOutlined className={'text-red'} style={{fontSize: 20}}/>
                    </Space>,
                    onClick: async (d: OrderGetPagedDto) => {
                        await cancel(d);
                    }
                },
                {
                    title: 'delete',
                    hiddenIf: (dto: OrderGetPagedDto) => dto.status !== ORDER_STATUS_ENUM.DA_HUY,
                    icon: <Space wrap className={'text-red'}>
                        <Delete2Icon style={{fontSize: 20}}/>
                    </Space>,
                    onClick: async (d: OrderGetPagedDto) => {
                        await remove(d);
                    }
                }
            ],
            viewAction: async (d: OrderGetPagedDto) => {
                try {
                    UiUtils.setBusy();
                    const fetchResult = await OrderRestaurantService.getOrderById({idHash: d.idHash});

                    if (!fetchResult.isSuccessful) {
                        UiUtils.showError(fetchResult.message);
                        return;
                    }

                    const order = {...fetchResult.data};
                    orderStateStore.setOrders([order])
                    orderStateStore.setOrderSelected(order)
                    setIsOpen && setIsOpen(false);
                } catch (ex) {
                    console.error(ex)
                } finally {
                    UiUtils.clearBusy();
                }
            },
            ns: mainStore.getNamespaceLocale(),
        },
    );

    useEffect(() => {
        if (orderFilterStore.timeStampOrderListFilter) {
            mainStore.searchData({});
        }
    }, [orderFilterStore.timeStampOrderListFilter]);

    const remove = async (record: OrderGetPagedDto) => {
        UiUtils.showConfirm({
            title: t('Xoá đơn hàng'),
            icon: "remove",
            content: t(`Bạn có chắc chắn muốn xoá đơn hàng ${record.orderCode} này không`),
            onOk: async () => {
                try {
                    UiUtils.setBusy();
                    var result = await OrderRestaurantService.deleteOrder({idHash: record.idHash});
                    if (!result.isSuccessful) {
                        UiUtils.showError(result.message);
                        return;
                    }

                    UiUtils.showSuccess(`Xoá đơn hàng ${record.orderCode} thành công`);
                    orderFilterStore.setTimeStampOrderListFilter(new Date().getMilliseconds());
                } catch (ex) {
                    console.error(ex)
                } finally {
                    UiUtils.clearBusy();
                }
            },
        });
    }

    const cancel = async (dto: OrderGetPagedDto) => {
        setRecord(dto);
    }

    return (
        <>
            <OrdCrudPage
                hiddenTopAction={true}
                stored={mainStore}
                columns={columns}
                searchForm={(f) => <Search tableId={tableId}/>}
                // entityForm={(form) => <UpsertModal />}
                // contentTopTable={
                //     <ReservationStatusSegmented
                //         getCountApi={ReservationService.getCount}
                //     />
                // }
            ></OrdCrudPage>

            <CancelOrder setRecord={setRecord} record={record}/>
        </>
    );
};

export default memo(observer(OrderList));