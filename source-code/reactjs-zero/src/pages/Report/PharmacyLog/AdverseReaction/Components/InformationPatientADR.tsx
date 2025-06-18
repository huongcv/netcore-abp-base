import { GENDER, PharmacyAdverseReactionDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Input, Radio, DatePicker, Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import "../Form/index.scss";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import RequiredLabel from "./RequiredLabel";
const InformationPatientADR: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  const columns = [
    {
      title: <RequiredLabel title={t("patientFullName")} />,
      dataIndex: "patientFullName",
      render: () => (
        <Form.Item name="patientFullName" rules={[ValidateUtils.required]}>
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t("patientNation"),
      dataIndex: "patientNation",
      render: () => (
        <Form.Item name="patientNation">
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t("patientWeight"),
      dataIndex: "patientWeight",
      render: () => (
        <Form.Item name="patientWeight">
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t("patientHeight"),
      dataIndex: "patientHeight",
      render: () => (
        <Form.Item name="patientHeight">
          <Input />
        </Form.Item>
      ),
    },
    {
      title: t("patientAge"),
      dataIndex: "patientAge",
      render: () => (
        <Form.Item name="patientAge">
          <Input type="number" max={100} min={1} />
        </Form.Item>
      ),
    },
    {
      title: t("patientGender"),
      dataIndex: "patientGender",
      render: () => (
        <Form.Item name="patientGender">
          <Radio.Group>
            <Radio value={1 as GENDER}>{t("GENDER.1")}</Radio>
            <Radio value={2 as GENDER}>{t("GENDER.2")}</Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: <RequiredLabel title={t("dateStartReaction")} />,
      dataIndex: "dateStartReaction",
      render: () => (
        <Form.Item name="dateStartReaction" rules={[ValidateUtils.required]}>
          <OrdDateInput />
        </Form.Item>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      patientFullName: "",
      patientNation: "",
      patientWeight: "",
      patientHeight: "",
      patientAge: "",
      patientGender: "",
      dateStartReaction: "",
    },
  ];
  return (
    <>
      <Title level={5}>{t("title1")}</Title>
      <div className="border-container">
        <Row style={{ borderBottom: "1px solid #389e0d", marginTop: "10px" }}>
          <Col span={24}>
            <Title level={5}>{t("titleInfoPatientADR")}</Title>
          </Col>
        </Row>
        {/* Row 2: Bảng form nhập dữ liệu */}
        <Row style={{ margin: "10px 0 20px 0" }}>
          <Table
            style={{ width: "100%", tableLayout: "auto" }}
            scroll={{ x: "max-content", y: 240 }}
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </Row>
        {/* Row 3: Ghi chú / Mô tả */}
        <Row>
          <Col span={24}>
            <FloatLabel label={t("descriptionReactAndComment")}>
              <Form.Item name="descriptionReactAndComment">
                <TextArea rows={4} />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default InformationPatientADR;
