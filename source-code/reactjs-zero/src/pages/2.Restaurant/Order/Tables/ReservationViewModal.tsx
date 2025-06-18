import React from 'react';
import {useTranslation} from "react-i18next";
import DateUtil from "@ord-core/utils/date.util";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {Form, Space, TableColumnsType} from "antd";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {useStore} from "@ord-store/index";
import TableUtil from "@ord-core/utils/table.util";
import {FnbReservationDto} from "@api/index.defs";
import ReservationStatus from "@pages/2.Restaurant/Reservation/Utils/ReservationStatus";
import UpsertModal from "@pages/2.Restaurant/Reservation/Upsert/UpsertModal";
import {ReservationStatusSegmented} from "@pages/2.Restaurant/Reservation/Utils/ReservationSegment";
import {ReservationService} from "@api/ReservationService";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import OrderIcon2 from "@ord-components/icon/OrderIcon2";
import {RESERVATION_STATUS_ENUM} from "@pages/2.Restaurant/Reservation/Utils/Enum";
import {orderStateStore} from "@ord-store/Restaurant/Order/OrderStateStore";
import {getSysNoFromOrderCode, prefixNewOrderCode, prefixOrderCode} from '../Utils/Util';

type ReservationViewModalProps = {
    tableId?: number | undefined;
    setIsOpenReservation?: (isOpenReservation: boolean) => void;
}

const Search = (props: ReservationViewModalProps) => {
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
                placeHolder={t("searchPlaceHolderReservation")}
            />
            <Form.Item noStyle name='tableId' initialValue={tableId}/>
        </>
    );
};

const ReservationViewModal = (props: ReservationViewModalProps) => {
    const {tableId, setIsOpenReservation} = props;
    const {reservationStore: mainStore} = useStore();

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: "Khách hàng",
                dataIndex: "partnerName",
                width: 150,
            },
            {
                width: 150,
                title: "Số điện thoại",
                dataIndex: "partnerPhone",
            },
            {
                title: "Ngày đặt",
                width: 150,
                align: "center",
                dataIndex: "reservationDate",
                render: (data: any, record: FnbReservationDto) => {
                    return (
                        <>
                            {record.reservationDate
                                ? DateUtil.toFormat(record.reservationDate, "DD/MM/YYYY HH:MM")
                                : ""}
                        </>
                    );
                },
            },
            {
                title: "Số khách",
                dataIndex: "numberOfCustomer",
                width: 120,
            },
            {
                title: "Khu vực",
                dataIndex: "areaName",
                width: 120,
            },
            {
                title: "Bàn",
                dataIndex: "tableName",
                width: 120,
            },
            {
                title: "Trạng thái",
                align: "center",
                width: 100,
                render: (_: any, record: FnbReservationDto) => (
                    <ReservationStatus status={record.reservationStatus!}/>
                ),
            },
        ],
        {
            actions: [
                {
                    title: 'view',
                    onClick: (d: FnbReservationDto) => {
                        mainStore.openViewDetailModal(d);
                    }
                },
                {
                    title: 'createOrder',
                    hiddenIf: (d: FnbReservationDto) => d.reservationStatus !== RESERVATION_STATUS_ENUM.DA_XAC_NHAN,
                    icon: <Space wrap>
                        <OrderIcon2 style={{fontSize: 20}}/>
                    </Space>,
                    onClick: (d: FnbReservationDto) => {
                        addTable(d);
                    }
                }
            ],
            ns: mainStore.getNamespaceLocale(),
        },
    );

    const addTable = (dto: FnbReservationDto) => {
        const sysNo = getSysNoFromOrderCode(orderStateStore.orders);
        const newOrder: any = {
            tableId: dto.tableId,
            partnerId: dto.partnerId,
            reservationId: dto.id,
            orderCode: prefixNewOrderCode + sysNo,
            checked: true,
            details: []
        }

        orderStateStore.addOrder(newOrder);
        orderStateStore.setOrderSelected(newOrder);
        setIsOpenReservation && setIsOpenReservation(false);
    }

    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                hiddenTopAction={true}
                columns={columns}
                searchForm={(f) => <Search tableId={tableId}/>}
                entityForm={(form) => <UpsertModal/>}
                contentTopTable={
                    <div className='mt-3'>
                        <ReservationStatusSegmented
                            getCountApi={ReservationService.getCount}
                        />
                    </div>
                }
            ></OrdCrudPage>
        </>
    );
};

export default ReservationViewModal;