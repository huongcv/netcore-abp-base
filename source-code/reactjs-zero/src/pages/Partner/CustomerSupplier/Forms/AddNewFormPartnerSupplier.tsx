import { useTranslation } from "react-i18next";
import { Checkbox, Col, Form, Input } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

export const AddNewFormPartnerSupplier = () => {
  const [t] = useTranslation("customer-supplier");
  const [tCommon] = useTranslation();
  return (
    <>
      <Col span={12}>
        <FloatLabel label={t("name")} required>
          <Form.Item name={"name"} rules={[ValidateUtils.required]}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={6}>
        <FloatLabel label={t("code")}>
          <Form.Item name={"code"}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>

      <Col span={6}>
        <FloatLabel label={t("phone")}>
          <Form.Item name={"phone"} rules={[ValidateUtils.phoneNumberVietNam]}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={12}>
        <FloatLabel label={t("Address")}>
          <Form.Item name={"address"}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={12}>
        <FloatLabel label={t("Email")}>
          <Form.Item name={"email"} rules={[ValidateUtils.email]}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={24}>
        <FloatLabel label={t("notes")}>
          <Form.Item name={"notes"}>
            <TextArea autoSize />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={24}>
        <Form.Item name="isActived" valuePropName="checked" initialValue={true}>
          <Checkbox disabled>{tCommon("dang_hoat_dong")}</Checkbox>
        </Form.Item>
      </Col>
    </>
  );
};
