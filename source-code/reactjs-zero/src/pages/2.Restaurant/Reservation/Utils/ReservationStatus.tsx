import React, {memo} from 'react';
import {RESERVATION_STATUS} from "@api/index.defs";
import {Tag} from "antd";
import {RESERVATION_STATUS_ENUM} from "@pages/2.Restaurant/Reservation/Utils/Enum";

type ReservationStatusProps = {
    status: RESERVATION_STATUS,
}

const ReservationStatus = (props: ReservationStatusProps) => {
    const {status} = props;

    const getElement = () => {
        switch (status) {
            case  RESERVATION_STATUS_ENUM.NHAP:
                return (<Tag className="min-w-[100px] text-center ord-cell-draft me-0" bordered={false}>
                    Nháp
                </Tag>);
            case RESERVATION_STATUS_ENUM.CHO_XAC_NHAN :
                return (<Tag className="min-w-[100px] text-center ord-cell-pending me-0" bordered={false}>
                    Chờ xác nhận
                </Tag>);
            case RESERVATION_STATUS_ENUM.DA_XAC_NHAN :
                return (<Tag className="min-w-[100px] text-center ord-cell-actived me-0" bordered={false}>
                    Đã xác nhận
                </Tag>);
            case RESERVATION_STATUS_ENUM.KHACH_DA_TOI :
                return (<Tag className="min-w-[100px] text-center ord-cell-confirm me-0" bordered={false}>
                    Khách đã tới
                </Tag>);
            case RESERVATION_STATUS_ENUM.DA_CHON_CHO :
                return (<Tag className="min-w-[100px] text-center ord-cell-actived me-0" bordered={false}>
                    Đã chọn chỗ
                </Tag>);
            case RESERVATION_STATUS_ENUM.DA_HUY :
                return (<Tag className="min-w-[100px] text-center ord-cell-cancel me-0" bordered={false}>
                    Đã huỷ
                </Tag>);
            default:
        }
    }

    return (<>{getElement()}</>);
};

export default memo(ReservationStatus);