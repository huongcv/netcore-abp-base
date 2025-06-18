import { EnumAppraisalADR, EnumHandleADR, EnumReport } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Radio, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import "../Form/index.scss";
import Title from "antd/es/typography/Title";
import TextArea from "antd/es/input/TextArea";
import OrdDateInput from "@ord-components/forms/OrdDateInput";

const InfoReporter: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <>
      <Title level={5}>{t("InfoReporter")}</Title>
      <div className="border-container">
        <Row style={{ marginTop: "20px" }} gutter={16}>
          <Col span={8}>
            <FloatLabel label={t("createdTime")} required>
              <Form.Item name="createdTime">
                <OrdDateInput />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("reporterName")} required>
              <Form.Item name="reporterName" rules={[ValidateUtils.required]}>
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("reporterLevel")}>
              <Form.Item name="reporterLevel">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <FloatLabel label={t("reporterPhoneNumber")}>
              <Form.Item name="reporterPhoneNumber">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("reporterSignature")}>
              <Form.Item name="reporterSignature">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={8}>
            <FloatLabel label={t("reporterNumberFax")}>
              <Form.Item name="reporterNumberFax">
                <Input />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
        <Row gutter={16} align="middle">
          <Col style={{ fontWeight: "600", marginBottom: "10px" }} span={2}>
            {t("reportType")}
          </Col>
          <Col span={8}>
            <Form.Item name="reportType" rules={[ValidateUtils.required]}>
              <Radio.Group>
                <Radio value={1 as EnumReport}>Lần đầu</Radio>
                <Radio value={2 as EnumReport}>Bổ sung</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default InfoReporter;
