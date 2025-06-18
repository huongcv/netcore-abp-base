import { EnumHandleADR } from "@api/index.defs";
import { Row, Col, Radio, Form } from "antd";
import { useTranslation } from "react-i18next";
import "../Form/index.scss";
import Title from "antd/es/typography/Title";
const HowToHanldeADR: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <>
      <Title level={5}>{t("HowToHandleADR")}</Title>
      <div className="border-container">
        <Row
          gutter={16}
          align="middle"
          style={{ borderBottom: "1px solid #ddd" }}
        >
          <Col span={6}>{t("handlePauseADR")}</Col>
          <Col span={18}>
            <Col span={24}>
              <Form.Item name="handlePauseADR">
                <Radio.Group
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Radio value={1 as EnumHandleADR}>
                    {t("EnumHandleADR.1")}
                  </Radio>
                  <Radio value={2 as EnumHandleADR}>
                    {t("EnumHandleADR.2")}
                  </Radio>
                  <Radio value={3 as EnumHandleADR}>
                    {t("EnumHandleADR.3")}
                  </Radio>
                  <Radio value={4 as EnumHandleADR}>
                    {t("EnumHandleADR.4")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
        </Row>

        <Row gutter={16} align="middle">
          <Col span={6}>{t("handleUseOtherADR")}</Col>
          <Col span={18}>
            <Col span={24}>
              <Form.Item name="handleUseOtherADR">
                <Radio.Group
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Radio value={1 as EnumHandleADR}>
                    {t("EnumHandleADR.1")}
                  </Radio>
                  <Radio value={2 as EnumHandleADR}>
                    {t("EnumHandleADR.2")}
                  </Radio>
                  <Radio value={3 as EnumHandleADR}>
                    {t("EnumHandleADR.3")}
                  </Radio>
                  <Radio value={4 as EnumHandleADR}>
                    {t("EnumHandleADR.4")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default HowToHanldeADR;
