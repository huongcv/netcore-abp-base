import {useTranslation} from "react-i18next";
import {ExportStockMoveDto, ImportStockTicketDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {Alert, Form} from "antd";
import TextArea from "antd/lib/input/TextArea";
import {MoveStatusCell} from "@pages/StockManagement/Shared/DataTable/cell/MoveStatusCell";
import DateUtil from "@ord-core/utils/date.util";
import MoveRightPriceInformation from "@pages/StockManagement/Shared/Detail/RightBox/PriceInformation";
import {MoveStatus, MoveType,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {TransferFromStockToStock} from "@pages/StockManagement/Shared/Detail/RightBox/TransferFromStockToStock";
import {TranStockByMoveType} from "@pages/StockManagement/Shared/utils/TranStockByMoveType";

const StockMoveRightBox = (props: {
    moveDto: ExportStockMoveDto;
    ticketDto: ImportStockTicketDto;
}) => {
    const [moveDto, setMoveDto] = useState<ExportStockMoveDto | null>();
    const {t} = useTranslation(["stock-detail"]);
    const [tStock] = useTranslation(["stock"]);
    useEffect(() => {
        setMoveDto(props.moveDto);
    }, [props.moveDto]);

    return (
        <>
            {moveDto && (
                <>
                    <h3 className="text-primary text-xl font-bold">{t("MoveInfor")}</h3>
                    <table
                        className={
                            "w-full box-price-move-tbl right-box-move-" + moveDto?.moveType
                        }
                    >
                        <tbody>
                        <tr>
                            <td>{tStock("moveDate")}</td>
                            <td className="text-right infor-col">
                                {DateUtil.showWithFormat(moveDto?.moveDate, "dd/MM/yyyy HH:mm")}
                            </td>
                        </tr>
                        <tr>
                            <td>{tStock("moveCode")}</td>
                            <td className="text-right infor-col">{moveDto?.moveCode}</td>
                        </tr>
                        {moveDto?.relatedMoveIdHash && (
                            <tr className={"bg-red-200 relatedMoveId"}>
                                <td>
                                    <TranStockByMoveType
                                        name={"relatedMoveId"}
                                        moveType={moveDto.moveType}
                                    />
                                </td>
                                <td className="text-right infor-col">
                                    {moveDto.relatedMoveCode}
                                </td>
                            </tr>
                        )}

                        {/*{moveDto?.inventoryId && (*/}
                        {/*    <tr className={"inventoryId"}>*/}
                        {/*        <td>*/}
                        {/*            <TranStockByMoveType*/}
                        {/*                name={"InventoryId"}*/}
                        {/*                moveType={moveDto.moveType}*/}
                        {/*            />*/}
                        {/*        </td>*/}
                        {/*        <td className="text-right infor-col">*/}
                        {/*            {moveDto.inventoryName}*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*)}*/}

                        {!!moveDto && moveDto?.moveType == MoveType.PhieuDieuChuyen && (
                            <TransferFromStockToStock moveDto={moveDto}/>
                        )}
                        {moveDto?.partnerId && (
                            <tr>
                                <td>
                                    <TranStockByMoveType
                                        name={"PartnerId"}
                                        moveType={moveDto.moveType}
                                    />
                                </td>
                                <td className="text-right infor-col">
                                    {moveDto?.partnerName}
                                </td>
                            </tr>
                        )}

                        {!!moveDto && moveDto?.moveType == MoveType.PhieuNhapNhaCungCap && (
                            <>
                                <tr>
                                    <td>
                                        Mã hoá đơn
                                    </td>
                                    <td className="text-right infor-col">
                                        {moveDto?.partnerInvoiceCode}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Ngày tạo hoá đơn
                                    </td>
                                    <td className="text-right infor-col">
                                        {
                                            moveDto?.partnerInvoiceDate &&
                                            <> {DateUtil.showWithFormat(moveDto?.partnerInvoiceDate, "dd/MM/yyyy HH:mm")} </>
                                        }
                                    </td>
                                </tr>
                            </>
                        )}

                        <tr>
                            <td>{tStock("status")}</td>
                            <td className="text-right infor-col">
                                {moveDto && <MoveStatusCell record={moveDto as any}/>}
                            </td>
                        </tr>
                        {moveDto &&
                            !!moveDto.cancelReason &&
                            moveDto.moveStatus == MoveStatus.DA_HUY && (
                                <tr>
                                    <td colSpan={2}>
                                        <Alert
                                            message={moveDto?.cancelReason}
                                            type="warning"
                                            // closable
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {
                        moveDto.moveType != MoveType.PhieuKiemKho &&
                        <div style={{marginTop: -20}}>
                            <MoveRightPriceInformation
                                moveDto={moveDto}
                                ticketDto={props.ticketDto}
                            />
                        </div>
                    }

                    <div className={"note -mt-3"}>
                        <div>{t("notes")}</div>
                        <TextArea value={moveDto.note} autoSize={{minRows: 2, maxRows: 6}} disabled/>
                    </div>
                </>
            )}
        </>
    );
};
export default StockMoveRightBox;
