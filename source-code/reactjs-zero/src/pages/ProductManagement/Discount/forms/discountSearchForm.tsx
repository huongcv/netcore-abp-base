import { ShopDiscountDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { useSelectDiscountStatusType } from "@ord-components/forms/select/selectDataSource/useSelectDiscountStatusType";
import { useSelectVoucherType } from "@ord-components/forms/select/selectDataSource/useSelectVoucherType";
import { useSelectDiscountUseType } from "@ord-components/forms/select/selectDataSource/useSelectDiscountUseType";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { useStore } from "@ord-store/index";
import { Col, Space, Form } from "antd";
import { EventHandler, useState } from "react";
import { useTranslation } from "react-i18next";

export const DiscountSearchForm = (props: {
  defaultStatus?: number;
  changeHandler?: EventHandler<any>;
}) => {
  const { productDiscountStore: mainStore, sessionStore } = useStore();
  const { t } = useTranslation("discount");
  const { t: tEnum } = useTranslation("enum");
  const [discountListItem, setDiscountListItem] = useState<ShopDiscountDto>();

  const onChange = (value: string, option: IOrdSelectOption) => {
    setDiscountListItem(option.data);
    if (props.changeHandler) {
      props.changeHandler(option.data);
    }
  };
  return (
    <>
      <Col {...useResponsiveSpan(16)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          {/* <FloatLabel style={{ flex: 1 }} label={t("validDate")}>
            <Form.Item name="dateRange">
              <OrdDateRangeInput></OrdDateRangeInput>
            </Form.Item>
          </FloatLabel> */}
          <FloatLabel style={{ width: "35%" }} label={t("discountUseType")}>
            <Form.Item name="discountUseType">
              <OrdSelect
                onChange={onChange}
                datasource={useSelectDiscountUseType()}
              />
            </Form.Item>
          </FloatLabel>
          <FloatLabel style={{ width: "35%" }} label={t("discountType")}>
            <Form.Item name="discountType">
              <OrdSelect
                onChange={onChange}
                datasource={useSelectVoucherType()}
              />
            </Form.Item>
          </FloatLabel>

          <FloatLabel style={{ width: "35%" }} label={t("status")}>
            <Form.Item name="discountStatus">
              <OrdSelect
                onChange={onChange}
                datasource={useSelectDiscountStatusType()}
              />
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={8} />
    </>
  );
};
