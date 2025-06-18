import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useTranslation} from "react-i18next";

export const TranStockByMoveType = (props: {
    name: string,
    moveType?: number;
}) => {
    const [t] = useTranslation(['stock']);
    const tWithMoveType = (name: string) => {
        if (props.moveType) {
            let moveTypeL = '';
            const {moveType} = props;
            if (moveType == MoveType.PhieuNhapNhaCungCap || moveType == MoveType.PhieuNhapTon) {
                moveTypeL = 'import.';
            }
            if (moveType == MoveType.PhieuXuatHuy || moveType == MoveType.PhieuXuatTraNhaCungCap || moveType == MoveType.HoaDon) {
                moveTypeL = 'export.';
            }
            if (moveType == MoveType.PhieuDieuChuyen || moveType == MoveType.PhieuDieuChuyenNhan) {
                moveTypeL = 'transfer.';
            }

            if (moveType == MoveType.PhieuKiemKho) {
                moveTypeL = 'check.';
            }
            return t(moveTypeL + name);
        }
        return t(name);
    }
    return <>
        {tWithMoveType(props.name)}
    </>
}
