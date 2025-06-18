import FloatLabel from "@ord-components/forms/FloatLabel";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { Form, Row, Col, Input, Checkbox } from "antd";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";

const CreateOrUpdateCaddyGroupForm = () => {
  const { t } = useTranslation("caddy-group");
  const { t: tCommon } = useTranslation("common");
  const form = Form.useFormInstance();
  const [inputValue, setInputValue] = useState("");

  const focusRef = useAutoFocus();

  const debounceSetFieldsValue = useMemo(
    () =>
      debounce((value) => {
        form.setFieldsValue({
          groupCode: ValidateUtils.filterGroupCode(value),
        });
      }, 300),
    [form]
  );

  useEffect(() => {
    return () => {
      debounceSetFieldsValue.cancel();
    };
  }, [debounceSetFieldsValue]);

  return (
    <>
      <Row gutter={16}>
        <Col lg={16}>
          <FloatLabel label={t("ma")}>
            <Form.Item name="groupCode">
              <Input
                maxLength={10}
                value={inputValue}
                disabled={
                  form.getFieldValue("id") && form.getFieldValue("id") > 0
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                  debounceSetFieldsValue(value);
                }}
                ref={focusRef}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col lg={8}>
          <Form.Item
            name="isActived"
            initialValue={true}
            valuePropName="checked"
          >
            <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Col span={24}>
        <FloatLabel label={t("ten")} required>
          <Form.Item
            name="groupName"
            rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}
          >
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>
      <FloatLabel label={t("notes")}>
        <Form.Item name="notes" rules={[ValidateUtils.maxLength(100)]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </FloatLabel>
      <Form.Item hidden noStyle name="id">
        <Input hidden />
      </Form.Item>
      <Form.Item name="groupType" initialValue={4} hidden noStyle></Form.Item>
    </>
  );
};

export default observer(CreateOrUpdateCaddyGroupForm);
