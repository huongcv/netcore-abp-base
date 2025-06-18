import FloatLabel from "@ord-components/forms/FloatLabel";
import { Button, Col, Form, Input, Modal, Row, Space } from "antd";
import { LockerProps } from ".";
import { useEffect, useState } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import { PlusOutlined } from "@ant-design/icons";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { GolfLockerService } from "@api/GolfLockerService";
import UiUtils from "@ord-core/utils/ui.utils";
import { OrdSelectPartnerCustomer } from "./OrdSelectPartnerCustomer";
import { OrdSelectPartnerEmployee } from "./OrdSelectPartnerEmployee";
import { OrdSelectGolfLockerStatus } from "./OrdSelectGolfLockerStatus";
import {
  GolfLockerMaintenanceLogDto,
  GolfLockerPageDto,
  GolfLockerStatusEnum,
} from "@api/index.defs";
import dayjs, { Dayjs } from "dayjs";
import { GolfLockerMaintenanceLogService } from "@api/GolfLockerMaintenanceLogService";
import { useWatch } from "antd/es/form/Form";
const { TextArea } = Input;
export interface propsSelectDataSource {
  plac?: string;
  disabled?: boolean;
  onChange?: (data: any) => void;
  value?: any;
}
const ModalLockerForm = (props: LockerProps) => {
  const { isOpen, locker, mode } = props;
  const {
    id: lockerId,
    code: lockerCode,
    status,
    partnerId,
  } = locker ?? ({} as GolfLockerPageDto);
  const { golfLockerStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const partnerId_w = useWatch("partnerId", form);
  const rentStartDate_w = useWatch("rentStartDate", form);

  useEffect(() => {
    if (isOpen && isOpen === true) {
      form.resetFields();
      setDisabled(mode === "view-update");
      setIsModalOpen(isOpen);
    }
  }, [isOpen]);
  useEffect(() => {
    if (lockerId != undefined && lockerCode != undefined) {
      form.setFieldValue("lockerId", lockerId);
      form.setFieldValue("lockerCode", lockerCode);
      form.setFieldValue("partnerId", partnerId);
      form.setFieldValue(
        "rentStartDate",
        locker?.rentStartDate ?? (mode === "view-update" ? null : new Date())
      );
      form.setFieldValue("rentEndDate", locker?.rentEndDate);
      form.setFieldValue("notes", locker?.rentNotes);
      if (status === (3 as GolfLockerStatusEnum)) {
        fetchLogRepairLocker();
      }
    }
  }, [lockerId, lockerCode, partnerId]);

  useEffect(() => {
    if (partnerId_w) {
      form.setFieldValue("status", 1);
    }
  }, [partnerId_w]);

  const onOkModal = () => {
    form.submit();
  };
  const handleCancel = () => {
    clearDataInClose();
  };

  const clearDataInClose = () => {
    form.resetFields();
    setIsModalOpen(false);
    setDisabled(false);
    props.onClose?.();
  };

  const handleSubmit = async (value: any) => {
    UiUtils.setBusy();
    switch (mode) {
      case "provide": {
        await GolfLockerService.provideLockerForCustomer({ body: value })
          .then((res) => {
            if (res.isSuccessful) {
              UiUtils.showSuccess("Cấp phát tủ cho khách hàng thành công");
            }
          })
          .finally(() => {
            clearDataInClose();
            UiUtils.clearBusy();
            mainStore.refreshGridData(true).then();
          });
        break;
      }
      case "addNew": {
        await GolfLockerService.createOrUpdate({ body: value })
          .then((res) => {
            if (res.isSuccessful) {
              UiUtils.showSuccess("Cấp phát tủ cho khách hàng thành công");
            }
          })
          .finally(() => {
            clearDataInClose();
            UiUtils.clearBusy();
            mainStore.refreshGridData(true).then();
          });
        break;
      }
      case "repair": {
        const dataSend: GolfLockerMaintenanceLogDto = {
          conditionLocker: value.conditionLocker,
          lockerId: value.lockerId,
          maintenanceDate: value.maintenanceDate,
          notes: value.notes,
          performedById: value.performedById,
        };
        if (lockerId != undefined) {
          await GolfLockerMaintenanceLogService.createOrUpdate({
            body: dataSend,
          })
            .then((res) => {
              if (res.isSuccessful) {
                UiUtils.showSuccess("Thêm lịch sử bảo trì tủ thành công");
              }
            })
            .finally(() => {
              clearDataInClose();
              UiUtils.clearBusy();
              mainStore.refreshGridData(true).then();
            });
        }
        break;
      }
      default:
        break;
    }
  };
  const renderConditionalFields = () => {
    switch (mode) {
      case "repair":
        return <BaseRepair />;
      case "addNew":
        return (
          <>
            {partnerId_w != null ? (
              <>
                <Col span={12}>
                  <FloatLabel label={t("rentStartDate")} required>
                    <Form.Item
                      name="rentStartDate"
                      initialValue={new Date()}
                      rules={[ValidateUtils.required]}
                    >
                      <OrdDateTimeInput disabled={disabled} />
                    </Form.Item>
                  </FloatLabel>
                </Col>

                <Col span={12}>
                  <FloatLabel label={t("rentEndDate")}>
                    <Form.Item name="rentEndDate">
                      <OrdDateTimeInput disabled={disabled} />
                    </Form.Item>
                  </FloatLabel>
                </Col>
              </>
            ) : (
              <></>
            )}

            <Col span={12}>
              <FloatLabel label={t("partnerId")}>
                <Form.Item name="partnerId">
                  <OrdSelectPartnerCustomer
                    disabled={disabled}
                    plac={t("partnerId")}
                  />
                </Form.Item>
              </FloatLabel>
            </Col>
          </>
        );
      case "view-update":
        return status === 3 ? <BaseRepair /> : <BaseDefault />;
      case "provide":
      default:
        return <BaseDefault />;
    }
  };
  const BaseRepair = () => {
    return (
      <>
        <Col span={12}>
          <FloatLabel label={t("maintenanceDate")} required>
            <Form.Item
              name="maintenanceDate"
              initialValue={new Date()}
              rules={[ValidateUtils.required]}
            >
              <OrdDateTimeInput disabled={disabled} />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("performedById")}>
            <Form.Item name="performedById">
              <OrdSelectPartnerEmployee
                disabled={disabled}
                plac={t("performedById")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("conditionLocker")} required>
            <Form.Item
              name="conditionLocker"
              rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}
            >
              <Input disabled={disabled} placeholder={t("conditionLocker")} />
            </Form.Item>
          </FloatLabel>
        </Col>
      </>
    );
  };
  const BaseDefault = () => {
    return (
      <>
        <Col span={12}>
          <FloatLabel label={t("rentStartDate")} required>
            <Form.Item name="rentStartDate" rules={[ValidateUtils.required]}>
              <OrdDateTimeInput disabled={disabled} />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("rentEndDate")}>
            <Form.Item name="rentEndDate">
              <OrdDateTimeInput
                disabled={disabled}
                disabledDate={(current) => {
                  return current && current.isBefore(dayjs(rentStartDate_w));
                }}
              />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("partnerId")}>
            <Form.Item name="partnerId">
              <OrdSelectPartnerCustomer
                disabled={disabled}
                plac={t("partnerId")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </>
    );
  };
  const fetchLogRepairLocker = async () => {
    const data = await GolfLockerMaintenanceLogService.getLogByLockerId({
      lockerId: Number(lockerId),
    });
    if (data) {
      form.setFieldValue("maintenanceDate", data.maintenanceDate);
      form.setFieldValue("performedById", data.performedById);
      form.setFieldValue("conditionLocker", data.conditionLocker);
      form.setFieldValue("notes", data.notes);
      form.setFieldValue("status", 3 as GolfLockerStatusEnum);
    }
  };
  return (
    <>
      <Modal
        title={t(`modalLockerForm.${mode}`)}
        open={isModalOpen}
        width={550}
        maskClosable={false}
        onCancel={handleCancel}
        onClose={handleCancel}
        onOk={onOkModal}
        footer={
          <Space wrap>
            <ModalCloseBtn onClick={handleCancel} />
            {mode !== "view-update" ? (
              <Button
                type={"primary"}
                icon={<PlusOutlined />}
                onClick={onOkModal}
              >
                {t("save")}
              </Button>
            ) : (
              <></>
            )}
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FloatLabel label={t("lockerCode")}>
                <Form.Item hidden noStyle name="lockerId">
                  <Input />
                </Form.Item>
                <Form.Item name="lockerCode">
                  <Input disabled={mode === "addNew" ? false : true} />
                </Form.Item>
              </FloatLabel>
            </Col>

            <Col span={12}>
              <FloatLabel label={t("locationId")}>
                <Form.Item name="locationId">
                  <OrdSelect
                    datasource={[] as any}
                    allowClear
                    placeholder={t("locationId")}
                    disabled={disabled}
                  />
                </Form.Item>
              </FloatLabel>
            </Col>

            {renderConditionalFields()}

            <Col span={12}>
              <FloatLabel label={t("status")}>
                <Form.Item
                  name="status"
                  initialValue={
                    mode === "addNew" ? 2 : mode === "repair" ? 3 : 1
                  }
                >
                  <OrdSelectGolfLockerStatus
                    disabled={disabled || mode === "repair"}
                    plac={t("status")}
                  />
                </Form.Item>
              </FloatLabel>
            </Col>

            <Col span={24}>
              <FloatLabel
                label={
                  mode === "repair" || (mode === "view-update" && status === 3)
                    ? t("notesRepair")
                    : mode === "addNew"
                    ? t("notes")
                    : t("notesResent")
                }
              >
                <Form.Item name="notes" rules={[ValidateUtils.maxLength(200)]}>
                  <TextArea rows={2} disabled={disabled} />
                </Form.Item>
              </FloatLabel>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalLockerForm;
