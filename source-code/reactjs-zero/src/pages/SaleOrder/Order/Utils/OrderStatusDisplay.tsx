import React, { memo } from 'react';
import { Tag } from "antd";
import { ORDER_STATUS_ENUM } from './Util';
type OrderStatusProps = {
    status: ORDER_STATUS_ENUM;
}

const SaleOrderStatusDisplay = (props: OrderStatusProps) => {
    const { status } = props;

    const getElement = () => {
        switch (status) {
            case ORDER_STATUS_ENUM.NHAP:
                return (<Tag className="min-w-[100px] text-center ord-cell-draft me-0" bordered={false}>
                    Nháp
                </Tag>);
            case ORDER_STATUS_ENUM.MOI:
                return (<Tag className="min-w-[100px] text-center ord-cell-pending me-0" bordered={false}>
                    Mới
                </Tag>);
            case ORDER_STATUS_ENUM.DA_XAC_NHAN:
                return (<Tag className="min-w-[100px] text-center ord-cell-actived me-0" bordered={false}>
                    Đã xác nhận
                </Tag>);
            case ORDER_STATUS_ENUM.DA_NHAN_HANG:
                return (<Tag className="min-w-[100px] text-center ord-cell-confirm me-0" bordered={false}>
                    Đã thanh toán
                </Tag>);
            case ORDER_STATUS_ENUM.DA_HUY:
                return (<Tag className="min-w-[100px] text-center ord-cell-cancel me-0" bordered={false}>
                    Đã huỷ
                </Tag>);
            case ORDER_STATUS_ENUM.DA_HOAN_HANG:
                return (<Tag className="min-w-[100px] text-center ord-cell-cancel me-0" bordered={false}>
                    Đã hoàn thành
                </Tag>);
            default:
        }
    }

    return (<>{getElement()}</>);
};

export default memo(SaleOrderStatusDisplay);