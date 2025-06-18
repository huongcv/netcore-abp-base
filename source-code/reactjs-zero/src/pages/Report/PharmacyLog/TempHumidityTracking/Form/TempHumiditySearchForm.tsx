import { ShopWeatherDataDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { Col, Form, Space } from "antd";
import { EventHandler, useState } from "react";
import { useTranslation } from "react-i18next";

const TempHumiditySearchForm = (props: {
  defaultStatus?: number;
  changeHandler?: EventHandler<any>;
}) => {
  const { t } = useTranslation("tracking");
  return (
    <>
      <Col {...useResponsiveSpan(16)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <FloatLabel style={{ flex: 1 }} label={t("validDate")}>
            <Form.Item name="rangeDate">
              <OrdDateRangeInput></OrdDateRangeInput>
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={8} placeHolder={t("searchString")} />
    </>
  );
};

export default TempHumiditySearchForm;
