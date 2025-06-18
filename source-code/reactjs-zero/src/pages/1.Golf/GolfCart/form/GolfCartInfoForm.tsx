import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBuggyCurrentStatus } from "@ord-components/forms/select/selectDataSource/useSelectBuggyCurrentStatus";
import { useSelectBuggyGroup } from "@ord-components/forms/select/selectDataSource/useSelectBuggyGroup";
import { useSelectGolfArea } from "@ord-components/forms/select/selectDataSource/useSelectGolfArea";
import { useSelectGolfBuggyType } from "@ord-components/forms/select/selectDataSource/useSelectGolfBuggyType";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

export const GolfCartInfoForm = () => {
  const { t } = useTranslation("GolfBuggy");
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FloatLabel label={t("buggyCode")}>
            <Form.Item
              name="buggyCode"
              rules={[ValidateUtils.NoCharacterAscii]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("buggyName")} required>
            <Form.Item
              name="buggyName"
              rules={[
                ValidateUtils.mustBeSmallerThan(50),
                ValidateUtils.required,
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("licensePlate")} required>
            <Form.Item
              name="licensePlate"
              rules={[
                ValidateUtils.mustBeSmallerThan(20),
                ValidateUtils.required,
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FloatLabel label={t("buggyType")} required>
            <Form.Item name="buggyType" rules={[ValidateUtils.required]}>
              <OrdSelect datasource={useSelectGolfBuggyType()} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("currentStatus")} required>
            <Form.Item name="currentStatus" rules={[ValidateUtils.required]}>
              <OrdSelect datasource={useSelectBuggyCurrentStatus()} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("position")}>
            <Form.Item name="areaId">
              <OrdSelect datasource={useSelectGolfArea()} allowClear />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("buggyGroupId")}>
            <Form.Item name="buggyGroupId">
              <OrdSelect datasource={useSelectBuggyGroup()} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("note")}>
            <Form.Item
              name="note"
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
