import { Col, Form, Space } from "antd";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useTranslation } from "react-i18next";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import DateUtil from "@ord-core/utils/date.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectShop } from "@ord-components/forms/select/selectDataSource/useSelectShop";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { useSelectShopUsingIsStock } from "@ord-components/forms/select/selectDataSource/useSelectShopUsingIsStock";

const TransferStockSearchBox = () => {
  const [t] = useTranslation("stock");
  const initRange = DateUtil.getDateRange("thang_nay");
  const form = Form.useFormInstance();

  return (
    <>
      <Col {...useResponsiveSpan(20)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <Form.Item
            name="moveDateRange"
            initialValue={initRange}
            style={{ width: "30%" }}
          >
            <OrdDateRangeInput allowEq labelMode={"fromToLabel"} />
          </Form.Item>
          <FloatLabel label={t("supplierInfo")} style={{ width: "25%" }}>
            <Form.Item name="partnerId">
              <OrdSelect
                datasource={useSelectShopUsingIsStock()}
                allowClear
              ></OrdSelect>
            </Form.Item>
          </FloatLabel>
          <FloatLabel label={t("shopSell")} style={{ width: "25%" }}>
            <Form.Item name="shopId">
              <OrdSelect datasource={useSelectShop()} allowClear></OrdSelect>
            </Form.Item>
          </FloatLabel>
          <FloatLabel label={t("desiredDeliveryDate")} style={{ width: "25%" }}>
            <Form.Item name="desiredDeliveryDate">
              <OrdDateInput placeholder="--Chọn--"/>
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={4} />
      {/* <Col {...useResponsiveSpan(5)}>*/}
      {/*    <FloatLabel label={t('stockInventoryFilter')}>*/}
      {/*        <Form.Item name='inventoryId'>*/}
      {/*            <OrdSelect datasource={useSelectStock()} allowClear></OrdSelect>*/}
      {/*        </Form.Item>*/}
      {/*    </FloatLabel>*/}
      {/*</Col> */}
      {/*<Col {...useResponsiveSpan(5)}>*/}
      {/*    <FloatLabel label={t('partnerIdFilter')}>*/}
      {/*        <Form.Item name='partnerId'>*/}
      {/*            <OrdSelect datasource={useSelectPartnerSupplier()} allowClear></OrdSelect>*/}
      {/*        </Form.Item>*/}
      {/*    </FloatLabel>*/}
      {/*</Col>*/}
      <div hidden>
        <Form.Item name="moveType" noStyle></Form.Item>
      </div>
    </>
  );
};
export default TransferStockSearchBox;
