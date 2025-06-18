import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { Row, Col, Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import { useSelectGender } from "@ord-components/forms/select/selectDataSource/useSelectGender";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { useSelectProvince } from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import { useSelectDistrict } from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import { useSelectWard } from "@ord-components/forms/select/selectDataSource/useSelectWard";
import validateUtils from "@ord-core/utils/validate.utils";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";

export const CaddyBaseInfoForm = () => {
  const { t } = useTranslation("GolfCaddy");
  const form = Form.useFormInstance();

  const onChangeState = (val: any) => {
    form.setFieldValue("districtCode", null);
    form.setFieldValue("wardCode", null);
    form.setFieldValue("address", null);
  };

  const onChangeDistrict = (val: any) => {
    form.setFieldValue("wardCode", null);
    form.setFieldValue("address", null);
  };

  const onChangeWard = (_: any, val: any) => {
    if (val) {
      const data = JSON.parse(JSON.stringify(val.data ?? {}));
      form.setFieldValue("address", data?.areaFullName);
    } else {
      form.setFieldValue("address", null);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <FloatLabel label={t("code")}>
            <Form.Item name="code" rules={[ValidateUtils.NoCharacterAscii]}>
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("name")} required>
            <Form.Item
              name="name"
              rules={[
                ValidateUtils.mustBeSmallerThan(50),
                ValidateUtils.required,
              ]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("phone")}>
            <Form.Item name="phone" rules={[ValidateUtils.phoneNumberVietNam]}>
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("gender")}>
            <Form.Item name="gender" initialValue={1}>
              <OrdRadio datasource={useSelectGender()}></OrdRadio>
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FloatLabel label={t("dateOfBirth")}>
            <Form.Item name="dateOfBirth">
              <OrdDateInput />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("identityCardNumber")}>
            <Form.Item
              name="identityCardNumber"
              rules={[ValidateUtils.OnlyNumber]}
            >
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("email")}>
            <Form.Item name="email">
              <Input />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <FloatLabel label={t("cityCode")}>
            <Form.Item name="cityCode">
              <OrdSelect
                datasource={useSelectProvince()}
                onChange={onChangeState}
              ></OrdSelect>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("districtCode")}>
            <Form.Item name="districtCode">
              <OrdSelect
                datasource={useSelectDistrict(Form.useWatch("cityCode", form))}
                onChange={onChangeDistrict}
                allowClear
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("wardCode")}>
            <Form.Item name="wardCode">
              <OrdSelect
                datasource={useSelectWard(Form.useWatch("districtCode", form))}
                onChange={onChangeWard}
                allowClear
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("groupIds")}>
            <Form.Item name="groupIds">
              <OrdSelect
                datasource={useSelectPartnerGroup(4)}
                mode="multiple"
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("address")}>
            <Form.Item
              name="address"
              rules={[validateUtils.mustBeSmallerThan(200)]}
            >
              <Input></Input>
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FloatLabel label={t("note")}>
            <Form.Item name="note">
              <TextArea rows={3} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};
