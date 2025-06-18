import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useTranslation } from "react-i18next";

export const GolfCaddySearchForm = () => {
  const { t } = useTranslation("GolfCaddy");
  return (
    <>
      {/* <Col {...useResponsiveSpan(12)}>
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
      </Col> */}
      <SearchFilterText span={12} />
    </>
  );
};