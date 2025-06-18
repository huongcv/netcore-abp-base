import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { Row, Col, Form } from "antd";
import { useTranslation } from "react-i18next";

export const BuggyGroupSearchForm = () => {
  const { t } = useTranslation("buggy-group");
  return (
    <>
      <Col {...useResponsiveSpan(8)}>
        <FloatLabel label={t("isActived")}>
          <Form.Item name="isActived">
            <OrdSelect datasource={useSelectIsActived()} />
          </Form.Item>
        </FloatLabel>
      </Col>
      <SearchFilterText span={16} />
    </>
  );
};
