import FloatLabel from "@ord-components/forms/FloatLabel";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBatteryType } from "@ord-components/forms/select/selectDataSource/useSelectBatteryType";
import { useSelectGolfBuggyType } from "@ord-components/forms/select/selectDataSource/useSelectGolfBuggyType";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useSelectCustomPartnerType } from "@pages/Customer/Form/useSelectCustomPartnerType";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

export const GolfCartEngineeringInforForm = () => {
  const { t } = useTranslation("GolfBuggy");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <FloatLabel label={t("batteryType")}>
            <Form.Item name="batteryType">
              <OrdSelect datasource={useSelectBatteryType()} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={12}>
          <FloatLabel label={t("batteryCapacity")}>
            <Form.Item
              name="batteryCapacity"
              rules={[ValidateUtils.mustBeSmallerThan(20)]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FloatLabel label={t("maxSpeedKph")}>
            <Form.Item
              name="maxSpeedKph"
              rules={[ValidateUtils.mustBeSmallerThan(5)]}
            >
              <PriceNumberInput addonAfter="km/h" min={0} step={10} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("maxLoadKg")}>
            <Form.Item
              name="maxLoadKg"
              rules={[ValidateUtils.mustBeSmallerThan(5)]}
            >
              <PriceNumberInput addonAfter="kg" min={0} step={10} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("color")}>
            <Form.Item
              name="color"
              rules={[ValidateUtils.mustBeSmallerThan(50)]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};
