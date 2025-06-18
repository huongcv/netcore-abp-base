import { Checkbox, Col, Form, Input, InputNumber, Row } from "antd";
import { useTranslation } from "react-i18next";
import { useStore } from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectProductGroupType } from "@ord-components/forms/select/selectDataSource/useSelectProductGroupType";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import React from "react";

const { TextArea } = Input;
export const ProductGroupCreateOrUpdateForm = () => {
  const { t } = useTranslation("product-group-list");
  const { t: tCommon } = useTranslation("common");
  const { productGroupStore: mainStore } = useStore();

  return (
    <>
      <Row gutter={16}>
        {/* <Col span={6}>
                <FloatLabel label={t('OrderNumber')}>
                    <Form.Item name='orderNumber'>
                        <InputNumber className='w-full' ref={firstFocusRef}/>
                    </Form.Item>
                </FloatLabel>
            </Col> */}
        {/* <Col span={18}>
                <FloatLabel label={t('type')}>
                    <Form.Item name='type'>
                        <OrdSelect datasource={useSelectProductGroupType()}
                                   placeholder={tCommon('')}></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col> */}
        <Col span={9}>
          <FloatLabel
            label={t("code")}
            required={mainStore.createOrUpdateModal.mode === "update"}
          >
            <Form.Item
              name="groupCode"
              rules={
                mainStore.createOrUpdateModal.mode === "update"
                  ? [ValidateUtils.required]
                  : []
              }
            >
              <OrdInputRegexText maxLength={50} regex={RegexUtil.CodeRegex} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={9}>
          <Form.Item valuePropName="checked" name="isProductGroupChain">
            <Checkbox disabled={mainStore.createOrUpdateModal.mode === "viewDetail"}>{t("IsProductGroupChain")}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="isActived"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
          </Form.Item>
        </Col>
        <Col span={24}>
          <FloatLabel label={t("name")} required>
            <Form.Item name="groupName" rules={[ValidateUtils.required]}>
              <Input maxLength={200} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={24}>
          <FloatLabel label={t("Notes")}>
            <Form.Item name="notes" rules={[ValidateUtils.maxLength(200)]}>
              <TextArea
                autoSize
                disabled={mainStore.createOrUpdateModal.mode === "viewDetail"}
              />
            </Form.Item>
          </FloatLabel>
        </Col>

      </Row>
    </>
  );
};
