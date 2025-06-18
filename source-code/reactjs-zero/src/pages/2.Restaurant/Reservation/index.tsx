import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import UpsertModal from "@pages/2.Restaurant/Reservation/Upsert/UpsertModal";
import ReservationStatus from "@pages/2.Restaurant/Reservation/Utils/ReservationStatus";
import { Form, TableColumnsType } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CheckCircleOutlined, StopOutlined, TeamOutlined } from "@ant-design/icons";
import { FnbReservationDto, RESERVATION_STATUS } from "@api/index.defs";
import { ReservationService } from "@api/ReservationService";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import uiUtils from "@ord-core/utils/ui.utils";
import CheckoutModalForm from "../CentralBilling/form/CheckoutModalForm";
import CancelReservationModal from "./Utils/CancelReservationModal";
import { ReservationStatusSegmented } from "./Utils/ReservationSegment";
import { CheckoutIcon } from "@ord-components/icon/CheckoutIcon";

export const Search = () => {
    const { t } = useTranslation("reservation");
    const initRange = DateUtil.getDateRange("thang_nay");
    return (
        <>
            <ColSpanResponsive span={8}>
                <Form.Item name="moveDateRange" initialValue={initRange}>
                    <OrdDateRangeInput allowEq labelMode={"fromToLabel"} />
                </Form.Item>
            </ColSpanResponsive>
            <SearchFilterText
                hasAdvanceSearchBtn
                span={16}
                placeHolder={t("searchPlaceHolder")}
            />
        </>
    );
};

const Index = () => {
    const { t } = useTranslation("reservation");
    const { reservationStore: mainStore, paymentCentralBillingStore} = useStore();
    const [modalCancelVisible, setModalCancelVisible] = useState<boolean>(false);
    const [reservationSelected, setReservationSelected] =
        useState<FnbReservationDto | null>();

    const handleChangeStatus = (idHash: string, status: RESERVATION_STATUS) => {
        uiUtils.setBusy();
        ReservationService.changeStatus({
            idHash,
            status,
        })
            .then((res) => {
                uiUtils.clearBusy();
                if (res) {
                    uiUtils.showSuccess("Chuyển trạng thái thành công");
                } else {
                    uiUtils.showError("Chuyển trạng thái thất bại");
                }
                refreshDataGrid();
            })
            .finally(() => {
                uiUtils.clearBusy();
            });
    };

    const handleCloseCancelModal = () => {
        setReservationSelected(null);
        setModalCancelVisible(false);
    };

    const handleConfirmCancel = (reason: string) => {
        uiUtils.setBusy();
        ReservationService.cancel({
            body: {
                ...reservationSelected,
                canceledReason: reason,
            },
        })
            .then((res) => {
                uiUtils.clearBusy();
                if (res) {
                    uiUtils.showSuccess("Huỷ phiếu đặt bàn thành công");
                } else {
                    uiUtils.showSuccess("Huỷ phiếu đặt bàn thất bại");
                }
                refreshDataGrid();
            })
            .finally(() => {
                uiUtils.clearBusy();
            });
        setModalCancelVisible(false);
    };

    const refreshDataGrid = () => {
        mainStore.searchData({});
    };

    const topActions = [
        {
            title: "addNew",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];

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
                    <ReservationStatus status={record.reservationStatus!} />
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
                    title: t('checkout'),
                    icon: <CheckoutIcon />,
                    onClick: (d: FnbReservationDto) => {
                        paymentCentralBillingStore.openViewDetailModal(d);
                    }
                },
                {
                    title: 'edit',
                    hiddenIf: (d: FnbReservationDto) => {
                        return d.reservationStatus == 100000;
                    },
                    onClick: (d: FnbReservationDto) => {
                        mainStore.openUpdateModal(d);
                    }
                },
                {
                    title: "",
                    hiddenIf: (d: FnbReservationDto) => {
                        return d.reservationStatus == 900 || d.reservationStatus == 300 || d.reservationStatus == 100000;
                    },
                    content: (d: FnbReservationDto) => {
                        return d.reservationStatus === 100 ? (
                            <div
                                onClick={() => handleChangeStatus(d.idHash ?? "", 200)}
                                className="flex items-center cursor-pointer text-green-500"
                            >
                                <CheckCircleOutlined className="mr-1" />
                                <span>{t("Đã xác nhận")}</span>
                            </div>
                        ) : d.reservationStatus === 200 ? (
                            <div
                                onClick={() => handleChangeStatus(d.idHash ?? "", 300)}
                                className="flex items-center cursor-pointer text-blue-500"
                            >
                                <TeamOutlined className="mr-1" />
                                <span>{t("Khách đã tới")}</span>
                            </div>
                        ) : (
                            <></>
                        );
                    }
                },
                {
                    title: "cancel",
                    icon: (<StopOutlined />),
                    isDanger: true,
                    hiddenIf: (d: FnbReservationDto) => {
                        return d.reservationStatus == 100000
                    },
                    onClick: (d: FnbReservationDto) => {
                        setReservationSelected(d);
                        setModalCancelVisible(true);
                    },
                },
            ],
            ns: mainStore.getNamespaceLocale(),
        },
    );

    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <Search />}
                entityForm={(form) => <UpsertModal />}
                contentTopTable={
                    <ReservationStatusSegmented
                        getCountApi={ReservationService.getCount}
                    />
                }
                onEntitySavedSuccess={() => {
                    refreshDataGrid();
                }}
            ></OrdCrudPage>

            <CancelReservationModal
                visible={modalCancelVisible}
                onCancel={() => handleCloseCancelModal()}
                onConfirm={(reason) => handleConfirmCancel(reason)}
            />

            <CheckoutModalForm />
        </>
    );
};

export default Index;
