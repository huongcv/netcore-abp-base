import FloatLabel from "@ord-components/forms/FloatLabel";
import { Row, Col, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";
import "../Form/index.scss";
import Title from "antd/es/typography/Title";
const MedicineSameTime: React.FC = () => {
  const { t } = useTranslation("report_adverse_reaction");
  return (
    <>
      <Title level={5}>{t("ConcomitantMedicationsAndMedicalHistory")}</Title>
      <div className="border-container">
        <Row style={{ marginTop: 20 }} gutter={16}>
          <Col span={12}>
            <FloatLabel label={t("medicineInfoSameTimeLable")}>
              <Form.Item name="medicineInfoSameTime">
                <TextArea
                  rows={4}
                  placeholder={t("medicineInfoSameTimePlaceholder")}
                ></TextArea>
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={12}>
            <FloatLabel label={t("medicalHistoryLable")}>
              <Form.Item name="medicalHistory">
                <TextArea
                  rows={4}
                  placeholder={t("medicalHistoryPlaceholder")}
                ></TextArea>
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default MedicineSameTime;
