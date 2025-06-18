import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { ImportSupplierInput } from "@pages/StockManagement/ExportStock/FormUpsert/return-supplier/ImportSupplierInput";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
import withPriceMoveBoxRightFull from "@pages/StockManagement/Shared/hoc/withPriceMoveBoxRightFull";
import { IRightBoxProp } from "@pages/StockManagement/Shared/Upsert/Props";
import { MoveDateAndMoveCode } from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateAndMoveCode";
import { NoteInput } from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import PartnerSupplierInput from "@pages/StockManagement/Shared/Upsert/right/forms/PartnerSupplierInput";
import StockInitialValueInput from "@pages/StockManagement/Shared/Upsert/right/forms/StockInitialValueInput";
import { SaveBtnGroup } from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import TotalAmountBox from "@pages/StockManagement/Shared/Upsert/right/TotalAmountBox";
import { useUpsertStockMove } from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import { Col, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const ExportReturnSupplierRightBox = (props: IRightBoxProp) => {
  const { editData } = useUpsertStockMove();
  const [t] = useTranslation("stock");
  const { stockMoveStore } = useStore();
  const form = Form.useFormInstance();
  const relatedMoveId_w = Form.useWatch("relatedMoveId", form);

  const tWithMoveType = (name: string) => {
    return t(stockMoveStore.moveType + "." + name);
  };

  return (
    <>
      <div className="stock-right">
        <h3 className={"move-title-header"}>{t("ticketInfo")}</h3>
        <Row gutter={16}>
          <StockInitialValueInput />
          <MoveDateAndMoveCode />
          <Col span={24}>
            <FloatLabel label={tWithMoveType("PartnerId")} required>
              <Form.Item
                name={"partnerId"}
                rules={[ValidateUtils.requiredShortMess]}
              >
                <PartnerSupplierInput
                  disabled={!!relatedMoveId_w || !!editData}
                />
              </Form.Item>
            </FloatLabel>
          </Col>
          <ImportSupplierInput></ImportSupplierInput>
          <NoteInput
            disabled={
              editData?.moveDto?.moveType === MoveType.PhieuXuatTraNhaCungCap
            }
          />
        </Row>
      </div>
      <div className="stock-right mt-2">
        <h3 className={"move-title-header"}>{t("paymentInfo")}</h3>
        <Row gutter={16}>
          <TotalAmountBox></TotalAmountBox>
        </Row>
        <SaveBtnGroup {...props} />
      </div>
    </>
  );
};
export default observer(
  withPriceMoveBoxRightFull(ExportReturnSupplierRightBox)
);
