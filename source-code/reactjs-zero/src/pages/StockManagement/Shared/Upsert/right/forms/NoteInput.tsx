import { Col, Form, Input } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import React from "react";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";

const { TextArea } = Input;

export const NoteInput = (prop: { disabled?: boolean; title?: string }) => {
  const { disabled } = prop;
  const [t] = useTranslation("stock");

  return (
    <Col span={24}>
      <FloatLabel label={prop.title || t("notes")}>
        <Form.Item name={"note"} rules={[ValidateUtils.maxLength(200)]}>
          <TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear
            disabled={disabled}
          />
        </Form.Item>
      </FloatLabel>
    </Col>
  );
};
