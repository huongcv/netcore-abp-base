import { EnumHandleADR } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Radio, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import "../Form/index.scss";
import Title from "antd/es/typography/Title";

const HeaderReport: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <div className="border-container">
      <Row gutter={16} align={"middle"}>
        <Col span={12}>
          <Title level={3}>{t("titlePageCreateUpdateLvl2")}</Title>
          <Title style={{ marginTop: "0px", fontWeight: "400" }} level={5}>
            {t("titlePageCreateUpdateLvl2Eng")}
          </Title>
        </Col>
        <Col span={12} style={{ borderLeft: "0.5px solid #389e0d" }}>
          <Row style={{ marginTop: 20 }}>
            <Col span={24}>
              <FloatLabel label={t("reportName")} required>
                <Form.Item name="reportName" rules={[ValidateUtils.required]}>
                  <Input />
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
              <FloatLabel label={t("reportCodeUnit")}>
                <Form.Item name="reportCodeUnit">
                  <Input />
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row> */}
          <Row>
            <Col span={24}>
              <FloatLabel label={t("reportCodeCenter")}>
                <Form.Item name="reportCodeCenter">
                  <Input placeholder={t("reportCodeCenterPlaceholder")} />
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default HeaderReport;
