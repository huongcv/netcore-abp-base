import {StockMovePagedOutputDto} from "@api/index.defs";
import React from "react";
import {Tag} from "antd";
import {useTranslation} from "react-i18next";
import {MoveStatus} from "@pages/StockManagement/Shared/Const/StockMoveConst";

export const MoveStatusCell = (props: {
    record: StockMovePagedOutputDto
    ns?: string
}) => {
    const {t: tEnum} = useTranslation('enum');
    const status = () => {
        switch (props?.record?.moveStatus) {
            case  MoveStatus.DANG_SOAN:
                return (<Tag className="min-w-[100px] text-center ord-cell-draft me-0" bordered={false}>
                    {tEnum('ComboEnum.MoveStatusEnum.DangSoan')}
                </Tag>);
            case MoveStatus.CHO_TIEP_NHAN :
                return (<Tag className="min-w-[100px] text-center ord-cell-pending me-0" bordered={false}>
                    {tEnum('ComboEnum.MoveStatusEnum.ChoTiepNhan')}
                </Tag>);
            case MoveStatus.DA_HUY :
                return (<Tag className="min-w-[100px] text-center ord-cell-inactived me-0" bordered={false}>
                    {tEnum('ComboEnum.MoveStatusEnum.DaHuy')}
                </Tag>);
            case MoveStatus.DA_HOAN_THANH :
                return (<Tag className="min-w-[100px] text-center ord-cell-actived me-0" bordered={false}>
                    {tEnum('ComboEnum.MoveStatusEnum.DaHoanThanh')}
                </Tag>);
            case MoveStatus.HUY_TIEP_NHAN :
                return (<Tag className="min-w-[100px] text-center ord-cell-cancel me-0" bordered={false}>
                    {tEnum('ComboEnum.MoveStatusEnum.HuyTiepNhan')}
                </Tag>);
            default:
        }
    }
    return (<>{status()}</>);

}
