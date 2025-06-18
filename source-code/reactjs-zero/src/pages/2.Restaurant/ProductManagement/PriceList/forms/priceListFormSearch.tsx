import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import React, { EventHandler, useState } from "react";
import { Col, Form, Space } from "antd";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useTranslation } from "react-i18next";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { useStore } from "@ord-store/index";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { ProductPriceListDto } from "@api/index.defs";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";

export const PriceListFormSearch = (props: {
  defaultStatus?: number;
  changeHandler?: EventHandler<any>;
}) => {
  const { productPriceListStore: mainStore } = useStore();
  const { t } = useTranslation("price-list");
  const { t: tEnum } = useTranslation("enum");
  const [priceList, setPriceList] = useState<ProductPriceListDto>();
  const onChange = (value: string, option: IOrdSelectOption) => {
    //setPriceList(option.data);
    if (props.changeHandler) {
      props.changeHandler(option.data);
    }
  };
  return (
    <>
      <Col {...useResponsiveSpan(16)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <FloatLabel style={{ flex: 1 }} label={t("validDate")}>
            <Form.Item name="dateRange">
              <OrdDateRangeInput></OrdDateRangeInput>
            </Form.Item>
          </FloatLabel>
          <FloatLabel style={{ width: "30%" }} label={t("status")}>
            <Form.Item name="isActived">
              <OrdSelect
                allowClear
                onChange={onChange}
                datasource={useSelectIsActived()}
              />
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={8} />
    </>
  );
};
