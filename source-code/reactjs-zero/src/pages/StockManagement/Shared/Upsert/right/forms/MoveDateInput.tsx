import {Form, Space} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";

export const MoveDateInput = () => {
    const [t] = useTranslation("stock");
    const today = new Date();
    const form = Form.useFormInstance();
    const {editData} = useUpsertStockMove();

    const moveType_w = Form.useWatch("moveType", form);
    const label = () => {
        if (moveType_w == MoveType.PhieuNhapNhaCungCap || moveType_w == MoveType.PhieuNhapTon) {
            return t('import.moveDate');
        } else if (moveType_w == MoveType.PhieuXuatTraNhaCungCap) {
            return t('export.moveDate');
        } else if (moveType_w == MoveType.PhieuXuatHuy) {
            return t('exportOther.moveDate');
        } else if (moveType_w == MoveType.PhieuKiemKho) {
            return t('check.moveDate');
        } else if (moveType_w == MoveType.PhieuDieuChuyen) {
            return t('transferStock.moveDate');
        } else {
            return t('moveDate');
        }
    }
    return (
        <FloatLabel label={label()}>
            <Space.Compact style={{width: "100%"}}>
                <Form.Item
                    style={{flex: 1}}
                    name={"moveDate"}
                >
                    <OrdDateTimeInput
                        rootClassName='date-stock'
                        format={{
                            format: 'DD/MM/YYYY                         HH:mm',
                            type: 'mask',
                        }}
                        disabledDate={(current) => {
                            return current && current.second(0) > dayjs(today).second(0);
                        }}
                        disabled={editData?.moveDto?.moveType === MoveType.PhieuXuatTraNhaCungCap}
                    />
                </Form.Item>
            </Space.Compact>
        </FloatLabel>
    );
};
