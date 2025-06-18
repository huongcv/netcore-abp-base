import { EnumAppraisalADR, EnumHandleADR } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Radio, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import "../Form/index.scss";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";

const AppraisalADR: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <>
      <Title level={5}>{t("AppraisalADR")}</Title>
      <div className="border-container">
        <Row
          gutter={16}
          align="middle"
          //style={{ borderBottom: "1px solid #ddd" }}
        >
          <Col span={6}>{t("opinionMedicalUnitAppraisalADR")}</Col>
          <Col span={18}>
            <Col span={24}>
              <Form.Item name="opinionMedicalUnitAppraisalADR">
                <Radio.Group
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Radio value={1 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.1")}
                  </Radio>
                  <Radio value={2 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.2")}
                  </Radio>
                  <Radio value={3 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.3")}
                  </Radio>
                  <Radio value={4 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.4")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
        </Row>

        <Row gutter={16} align="middle">
          <Col span={6}>{t("opinionExpertAppraisalADR")}</Col>
          <Col span={18}>
            <Col span={24}>
              <Form.Item name="opinionExpertAppraisalADR">
                <Radio.Group
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Radio value={1 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.1")}
                  </Radio>
                  <Radio value={2 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.2")}
                  </Radio>
                  <Radio value={3 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.3")}
                  </Radio>
                  <Radio value={4 as EnumAppraisalADR}>
                    {t("EnumAppraisalADR.4")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }} gutter={16}>
          <Col span={24}>
            <Form.Item label={t("reviewBoardADR")} name="reviewBoardADR">
              <TextArea
                rows={4}
                placeholder={t("placeholderReviewBoardADR")}
              ></TextArea>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default AppraisalADR;
