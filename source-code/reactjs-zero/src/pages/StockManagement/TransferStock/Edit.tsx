import {TransferStockService} from "@api/TransferStockService";
import UiUtils from "@ord-core/utils/ui.utils";
import {MoveStatus, MoveType,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import AddNewTransferStock from "@pages/StockManagement/TransferStock/AddNew";
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useParams} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

const EditTransferStock = () => {
    let {id} = useParams();
    const navigate = useNavigate();
    const [tickedDto, setTicketDto] = useState<any>(null);
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useEffect(() => {
        if (id) {
            loadMoveTicket().then();
        }
    }, [id]);
    const loadMoveTicket = async () => {
        UiUtils.setBusy();
        try {
            const result = await TransferStockService.getById({
                idHash: id as string,
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            //Nếu phiếu điều chuyển đã hoàn thành => back lại màn hình danh sách
            if (
                result.data?.moveDto?.moveType === MoveType.PhieuDieuChuyenNhan ||
                (result.data?.moveDto?.moveType === MoveType.PhieuDieuChuyen &&
                    result.data?.moveDto?.moveStatus === MoveStatus.DA_HOAN_THANH)
            ) {
                navigate(pathNameRef.current + "/transfer");
                return;
            }

            setTicketDto(result.data);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    return <>{tickedDto && <AddNewTransferStock editData={tickedDto}/>}</>;
};
export default observer(EditTransferStock);
