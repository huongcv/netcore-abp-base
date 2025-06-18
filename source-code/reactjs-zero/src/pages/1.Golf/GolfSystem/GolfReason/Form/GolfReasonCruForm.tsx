import FloatLabel from "@ord-components/forms/FloatLabel";
import { Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TextArea from "antd/es/input/TextArea";

const GolfReasonCruForm = () => {
  const { t } = useTranslation("golfReason");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("reasonCode")}>
            <Form.Item
              name="reasonCode"
              rules={[
                ValidateUtils.NoCharacterAscii,
                ValidateUtils.mustBeSmallerThan(50),
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("reasonName")} required>
            <Form.Item
              name="reasonName"
              rules={[
                ValidateUtils.mustBeSmallerThan(200),
                ValidateUtils.required,
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("reasonNote")}>
            <Form.Item
              name="reasonNote"
              rules={[ValidateUtils.mustBeSmallerThan(200)]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};

export default GolfReasonCruForm;
