import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { Col, Space, Form } from "antd";
import { EventHandler } from "react";
import { useTranslation } from "react-i18next";

const CleaningTaskSearchForm = (props: {
  defaultStatus?: number;
  changeHandler?: EventHandler<any>;
}) => {
  const { t } = useTranslation("cleaningTask");
  return (
    <>
      <Col {...useResponsiveSpan(10)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <FloatLabel style={{ flex: 1 }} label={t("rangedate")}>
            <Form.Item name="rangeDate">
              <OrdDateRangeInput></OrdDateRangeInput>
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={14} placeHolder={t("searchValue")} />
    </>
  );
};

export default CleaningTaskSearchForm;
