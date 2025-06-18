import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import FloatLabel from "@ord-components/forms/FloatLabel";
import validateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Row, Col, Form, Input, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

const BuggyGroupCruForm = () => {
  const { golfBuggyGroupStore: mainStore } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("buggy-group");

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <FloatLabel label={t("buggyGroupCode")}>
            <Form.Item name="buggyGroupCode">
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("isActived")}>
            <Form.Item name="isActived" style={{ padding: "0.5rem" }}>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("buggyGroupName")} required>
            <Form.Item
              name="buggyGroupName"
              rules={[
                validateUtils.required,
                validateUtils.mustBeSmallerThan(100),
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("notes")}>
            <Form.Item name="notes">
              <TextArea rows={3} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};

export default observer(BuggyGroupCruForm);
