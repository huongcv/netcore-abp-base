import FloatLabel from "@ord-components/forms/FloatLabel";
import { Col, Form, Input, Row, Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const BasicInformationComponent: React.FC<{
  disabledProp: boolean;
}> = React.memo(({ disabledProp }) => {
  const { t } = useTranslation("promotion");
  const { id } = useParams<{ id?: string }>();

  return (
    <>
      <div className="header-container-promotion">
        {t("imformationpromotion")}
      </div>
      <Form.Item noStyle name="id">
        <Input hidden></Input>
      </Form.Item>
      <Row style={{ marginTop: "20px" }} gutter={16}>
        <Col span={12}>
          <FloatLabel label={t("Name")}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: t("RequiredName") }]}
            >
              <Input
                disabled={disabledProp}
                placeholder={t("PlaceholderName")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("Code")}>
            <Form.Item name="code">
              <Input
                disabled={id ? true : false}
                placeholder={t("PlaceholderCode")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <FloatLabel label={t("Description")}>
        <Form.Item name="description">
          <Input.TextArea
            rows={3}
            disabled={disabledProp}
            placeholder={t("PlaceholderDescription")}
          />
        </Form.Item>
      </FloatLabel>
    </>
  );
});
export default BasicInformationComponent;
