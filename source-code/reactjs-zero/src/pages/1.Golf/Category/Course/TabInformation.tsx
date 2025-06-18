import FloatLabel from "@ord-components/forms/FloatLabel";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectGolfCourseCurrentStatus } from "@ord-components/forms/select/selectDataSource/useSelectGolfCourseCurrentStatus";
import { useSelectCourseType } from "@ord-components/forms/select/selectDataSource/useSelectCourseType";
import { useSelectGolfArea } from "@ord-components/forms/select/selectDataSource/useSelectGolfArea";
import { useSelectGolfGameTypeDefault } from "@ord-components/forms/select/selectDataSource/useSelectGolfGameTypeDefault";
const { TextArea } = Input;

export const TabInformation = () => {
  const { golfCourseStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const form = Form.useFormInstance();
  return (
    <>
      <Form.Item noStyle hidden name="id"></Form.Item>
      <Row className="w-full" gutter={16}>
        <Col span={8}>
          <FloatLabel label={t("code")}>
            <Form.Item name="code">
              <Input></Input>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={16}>
          <FloatLabel label={t("name")} required>
            <Form.Item name="name" rules={[ValidateUtils.required]}>
              <Input></Input>
            </Form.Item>
          </FloatLabel>
        </Col>
        {/* <Col span={8}>
          <FloatLabel label={t("holeCount")}>
            <Form.Item name="holeCount" initialValue={9}>
              <Select>
                <Select.Option value={9}>9</Select.Option>
                <Select.Option value={18}>18</Select.Option>
                <Select.Option value={27}>27</Select.Option>
                <Select.Option value={36}>36</Select.Option>
                <Select.Option value={36}>9x</Select.Option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col> */}
        {/*  */}

        {/*  */}
        <Col span={8}>
          <FloatLabel label={t("areaName")}>
            <Form.Item name="areaId">
              <OrdSelect
                datasource={useSelectGolfArea()}
                allowClear
                placeholder={t("areaName")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("courseType")}>
            <Form.Item name="courseType" initialValue={1}>
              <OrdSelect
                datasource={useSelectCourseType()}
                allowClear
                placeholder={t("courseType")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("currentStatus")}>
            <Form.Item name="currentStatus" initialValue={1}>
              <OrdSelect
                datasource={useSelectGolfCourseCurrentStatus()}
                allowClear
                placeholder={t("currentStatus")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      {/*  */}
      <Row className="w-full" gutter={16}>
        <Col span={24}>
          <FloatLabel label={t("description")}>
            <Form.Item name="description">
              <TextArea className="w-full" rows={2} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};
