import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBuggyCurrentStatus } from "@ord-components/forms/select/selectDataSource/useSelectBuggyCurrentStatus";
import { useSelectGolfBuggyType } from "@ord-components/forms/select/selectDataSource/useSelectGolfBuggyType";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { Col, Form, Space } from "antd";
import { useTranslation } from "react-i18next";

export const GolfCartSearchForm = () => {
  const { t } = useTranslation("GolfBuggy");
  return (
    <>
      <Col {...useResponsiveSpan(12)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <FloatLabel style={{ width: "50%" }} label={t("currentStatus")}>
            <Form.Item name="currentStatus">
              <OrdSelect datasource={useSelectBuggyCurrentStatus()} />
            </Form.Item>
          </FloatLabel>
          <FloatLabel style={{ width: "50%" }} label={t("buggyType")}>
            <Form.Item name="buggyType">
              <OrdSelect datasource={useSelectGolfBuggyType()} />
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={12} />
    </>
  );
};
