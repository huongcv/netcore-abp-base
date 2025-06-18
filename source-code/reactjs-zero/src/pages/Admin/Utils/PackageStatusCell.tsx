import React from 'react';
import {Tag} from "antd";

export enum ShopPackageRegistrationStatusEnum {
    IsPending = 1,
    IsActived = 2,
    IsExpiration = 3,
    IsCancel = 4,
}

type PackageStatusCellProps = {
    status?: ShopPackageRegistrationStatusEnum;
}

const PackageStatusCell = (props: PackageStatusCellProps) => {
    const {status} = props;

    const getElement = () => {
        switch (status) {
            case  ShopPackageRegistrationStatusEnum.IsPending:
                return (<Tag className="min-w-[100px] text-center ord-cell-draft me-0" bordered={false}>
                    Chờ kích hoạt
                </Tag>);
            case ShopPackageRegistrationStatusEnum.IsActived :
                return (<Tag className="min-w-[100px] text-center ord-cell-actived me-0" bordered={false}>
                    Đang kích hoạt
                </Tag>);
            case ShopPackageRegistrationStatusEnum.IsExpiration :
                return (<Tag className="min-w-[100px] text-center ord-cell-pending me-0" bordered={false}>
                    Hết hạn
                </Tag>);
            case ShopPackageRegistrationStatusEnum.IsCancel :
                return (<Tag className="min-w-[100px] text-center ord-cell-cancel me-0" bordered={false}>
                    Hủy bỏ
                </Tag>);
            default:
        }
    }

    return (<>{getElement()}</>);
};

export default PackageStatusCell;