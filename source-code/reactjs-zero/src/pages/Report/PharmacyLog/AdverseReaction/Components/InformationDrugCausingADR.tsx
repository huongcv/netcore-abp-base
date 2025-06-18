import {
  EnumReuseDrugs,
  InformationMedicineCausingADRModel,
} from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Input, Radio, Form, Table, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import "../Form/index.scss";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useStore } from "@ord-store/index";
import RequiredLabel from "./RequiredLabel";

const InformationDrugCausingADR: React.FC<{
  props: InformationMedicineCausingADRModel | undefined;
}> = ({ props }) => {
  const { t } = useTranslation("report_adverse_reaction");
  const { reportPharmacyLogAdverseReactionStore: mainStore } = useStore();

  return (
    <>
      <Title level={5}>{t("InformationDrugsSuspectedCausingADRs")}</Title>
      <div className="border-container">
        <Form.List
          name={["informationMedicineCausingADRModel", "suspectedDrugs"]}
          initialValue={props?.suspectedDrugs || []}
        >
          {(fields, { add, remove }) => {
            const columns = [
              {
                title: <RequiredLabel title={t("drugName")} />,
                dataIndex: "drugName",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "drugName"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("drugName")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("concentration")} />,
                dataIndex: "concentration",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "concentration"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("concentration")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("singleDose")} />,
                dataIndex: "singleDose",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "singleDose"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("singleDose")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("dosageFrequency")} />,
                dataIndex: "dosageFrequency",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "dosageFrequency"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("dosageFrequency")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("administrationRoute")} />,
                dataIndex: "administrationRoute",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "administrationRoute"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("administrationRoute")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("treatmentStartDate")} />,
                dataIndex: "treatmentStartDate",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "treatmentStartDate"]}
                    rules={[ValidateUtils.required]}
                  >
                    <OrdDateInput />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("treatmentEndDate")} />,
                dataIndex: "treatmentEndDate",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "treatmentEndDate"]}
                    rules={[ValidateUtils.required]}
                  >
                    <OrdDateInput />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("batchNumber")} />,
                dataIndex: "batchNumber",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "batchNumber"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("batchNumber")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("expiryDate")} />,
                dataIndex: "expiryDate",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "expiryDate"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("expiryDate")} />
                  </Form.Item>
                ),
              },
              {
                title: <RequiredLabel title={t("manufacturer")} />,
                dataIndex: "manufacturer",
                render: (_: any, field: any) => (
                  <Form.Item
                    name={[field.name, "manufacturer"]}
                    rules={[ValidateUtils.required]}
                  >
                    <Input placeholder={t("manufacturer")} />
                  </Form.Item>
                ),
              },
              {
                title: t(""),
                dataIndex: "actions",
                render: (_: any, field: any) =>
                  fields.length > 1 ? (
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(field.name)}
                    >
                      <MinusCircleOutlined />
                    </Button>
                  ) : null,
              },
            ];

            return (
              <>
                <Table
                  style={{
                    marginTop: "10px",
                  }}
                  columns={columns}
                  dataSource={fields}
                  pagination={false}
                  bordered
                  rowKey={(record) => record.key}
                />
                {/* Nút Thêm thuốc */}
                <Row style={{ display: "flex", justifyContent: "end" }}>
                  <Button
                    type="dashed"
                    onClick={() => add(mainStore.initValueSuspectedDrug)}
                    style={{ margin: 10 }}
                  >
                    <PlusOutlined /> {t("PlusOutlined")}
                  </Button>
                </Row>
              </>
            );
          }}
        </Form.List>
        <Row style={{ marginTop: 10 }} gutter={16}>
          <Col span={24}>
            <FloatLabel label={t("diagnosisAndTreatmentIndication")}>
              <Form.Item
                name={[
                  "informationMedicineCausingADRModel",
                  "diagnosisAndTreatmentIndication",
                ]}
              >
                <TextArea rows={4}></TextArea>
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
        <Row gutter={16} align="middle">
          <Col style={{ fontWeight: "600", marginBottom: "10px" }} span={4}>
            {t("isDrugReused")}
          </Col>
          <Col span={12}>
            <Form.Item
              name={["informationMedicineCausingADRModel", "isDrugReused"]}
            >
              <Radio.Group>
                <Radio value={1 as EnumReuseDrugs}>
                  {t("EnumReuseDrugs.1")}
                </Radio>
                <Radio value={2 as EnumReuseDrugs}>
                  {t("EnumReuseDrugs.2")}
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default InformationDrugCausingADR;
