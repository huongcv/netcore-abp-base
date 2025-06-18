import { EnumResultHandleADR } from "@api/index.defs";
import { Row, Col, Radio, Form, Input } from "antd";
import "../Form/index.scss";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
const ResultHandleADR: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <>
      <Title level={5}>{t("ResultHandleADR")}</Title>
      <div className="border-container">
        <Row gutter={16} align="middle" style={{ marginTop: "10px" }}>
          <Col span={24}>
            <Form.Item name="resultHandleADR">
              <Radio.Group
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Radio value={1 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.1")}
                </Radio>
                <Radio value={2 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.2")}
                </Radio>
                <Radio value={3 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.3")}
                </Radio>
                <Radio value={4 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.4")}
                </Radio>
                <Radio value={5 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.5")}
                </Radio>
                <Radio value={6 as EnumResultHandleADR}>
                  {t("EnumResultHandleADR.6")}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default ResultHandleADR;
