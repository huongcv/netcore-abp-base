import { Col, Form, Select } from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { ModelUnitAmountPromotion, optionsUnit } from "../../Helper/Helper";
import { TYPE_PROMOTION } from "../../Enums/TypePromotionDetail";

const InputAmountAndUnitSelect: React.FC<{
  nameIndex: number;
  disabledProp: boolean;
}> = ({ nameIndex, disabledProp }) => {
  const { t } = useTranslation("promotion");
  const form = Form.useFormInstance();
  const [unitAmountPromo, setUnitAmountPromo] =
    useState<ModelUnitAmountPromotion>();

  const returnValueMaxInput = (nameIndex: number) => {
    if (!unitAmountPromo) return undefined;
    const { nameIndex: storedNameIndex, valueSelected } = unitAmountPromo;
    if (
      nameIndex === storedNameIndex &&
      valueSelected === optionsUnit[1].value
    ) {
      return 100;
    }

    return undefined;
  };
  return (
    <>
      <Col span={4}>
        <FloatLabel label={t("Amount")}>
          <Form.Item
            name={[nameIndex, "value", "amount"]}
            rules={[
              {
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(new Error(t("requiredAmount")));
                  }
                  if (
                    unitAmountPromo?.valueSelected === optionsUnit[1].value &&
                    value > 100
                  ) {
                    return Promise.reject(
                      new Error(t("Max 100 when unit is %"))
                    );
                  }
                  const promotionType = form.getFieldValue("promotionType");
                  if (promotionType == TYPE_PROMOTION.Invoice) {
                    const getValueAmountCondition = form.getFieldValue([
                      "details",
                      nameIndex,
                      "condition",
                      "totalAmountFrom",
                    ]);
                    const getUnitAmountCondition = form.getFieldValue([
                      "details",
                      nameIndex,
                      "value",
                      "unit",
                    ]);
                    if (
                      getValueAmountCondition > 0 &&
                      value > getValueAmountCondition &&
                      getUnitAmountCondition == optionsUnit[0].value
                    ) {
                      return Promise.reject(
                        new Error(t("more than the condition amount"))
                      );
                    }
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <PriceNumberInput
              disabled={disabledProp}
              step={1000}
              min={0}
              max={returnValueMaxInput(nameIndex)}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={2}>
        <FloatLabel label={t("UnitDiscount")}>
          <Form.Item
            name={[nameIndex, "value", "unit"]}
            rules={[{ required: true, message: t("requiredUnit") }]}
          >
            <Select
              onChange={(value) => {
                setUnitAmountPromo({
                  nameIndex: nameIndex,
                  valueSelected: value,
                });
              }}
              disabled={disabledProp}
            >
              {optionsUnit.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </FloatLabel>
      </Col>
    </>
  );
};

export default InputAmountAndUnitSelect;
