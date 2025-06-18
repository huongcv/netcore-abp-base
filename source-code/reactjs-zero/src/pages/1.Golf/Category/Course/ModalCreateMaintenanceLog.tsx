import { PlusOutlined } from "@ant-design/icons";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Input, Modal, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useEffect, useState } from "react";
import { GolfCourseMaintenanceLogDto } from "@api/index.defs";
import { GolfCourseMaintenanceLogService } from "@api/GolfCourseMaintenanceLogService";
import UiUtils from "@ord-core/utils/ui.utils";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
const { TextArea } = Input;

const ModalCreateMaintenanceLog = (props: {
  isOpen: boolean;
  courseId: string | undefined;
}) => {
  const { golfMaintenanceStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (props.isOpen && props.courseId != undefined)
      setIsModalOpen(props.isOpen);
  }, [props]);

  const onOkModal = () => {
    form.submit();
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleSubmit = async (value: GolfCourseMaintenanceLogDto) => {
    value.courseId = props.courseId;
    await GolfCourseMaintenanceLogService.createOrUpdate({ body: value })
      .then((res) => {
        if (res.isSuccessful) {
          UiUtils.showSuccess("Lưu lịch sử bảo trì thành công");
        }
      })
      .finally(() => {
        setIsModalOpen(false);
      });
  };
  return (
    <Modal
      title={t("modalCreateMaintenanceLog")}
      open={isModalOpen}
      width={550}
      maskClosable={false}
      onCancel={handleCancel}
      onOk={onOkModal}
      footer={
        <Space wrap>
          <ModalCloseBtn onClick={handleCancel} />
          <Button type={"primary"} icon={<PlusOutlined />} onClick={onOkModal}>
            {t("save")}
          </Button>
        </Space>
      }
    >
      <Form form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <FloatLabel label={t("maintenanceDate")} required>
              <Form.Item
                name="maintenanceDate"
                rules={[ValidateUtils.required]}
                initialValue={new Date()}
              >
                <OrdDateTimeInput></OrdDateTimeInput>
              </Form.Item>
            </FloatLabel>
          </Col>

          <Col span={12}>
            <FloatLabel label={t("performedById")}>
              <Form.Item name="performedById">
                <OrdSelect
                  datasource={useSelectEmployee()}
                  allowClear
                  placeholder={t("performedById")}
                />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col span={24}>
            <FloatLabel label={t("notes")} required>
              <Form.Item
                name="notes"
                rules={[ValidateUtils.maxLength(200), ValidateUtils.required]}
              >
                <TextArea rows={3} />
              </Form.Item>
            </FloatLabel>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default ModalCreateMaintenanceLog;
