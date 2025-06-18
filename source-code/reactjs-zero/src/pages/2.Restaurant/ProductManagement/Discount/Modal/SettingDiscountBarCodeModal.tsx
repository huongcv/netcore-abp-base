import { DiscountBarCodeLayoutSettingDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import {
  Button,
  Card,
  Checkbox,
  CheckboxChangeEvent,
  Col,
  Form,
  Modal,
  Row,
  Space,
} from "antd";
import { observable } from "mobx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import { DiscountBarCodeService } from "@api/DiscountBarCodeService";
import { SaveFilled } from "@ant-design/icons";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBarcodeLayoutType } from "@ord-components/forms/select/selectDataSource/useSelectBarcodeLayoutType";
import { SettingDiscountBarCodeForm } from "../forms/SettingDiscountBarCodeForm";

const SettingDiscountBarCodeModal = (props: {
  isModalOpen: boolean;
  onCloseModal: () => void;
}) => {
  const { sessionStore } = useStore();
  const [t] = useTranslation("discount");
  const { productListPrintBarCode } = useStore();
  const { isModalOpen, onCloseModal } = props;
  const [form] = Form.useForm();
  const [setting, setSetting] = useState<DiscountBarCodeLayoutSettingDto[]>();

  useEffect(() => {
    if (!!props.isModalOpen) {
      getSetting().then();
    }
  }, [props.isModalOpen]);

  const getSetting = async () => {
    UiUtils.setBusy();
    try {
      const items = await DiscountBarCodeService.getSetting({
        currentShopName: sessionStore.currentShopName,
      });
      setSetting(items);
      form.setFieldValue("items", items);
      form.setFieldValue("barcodeLayout", items[0].layoutType);
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  };
  const handleCancel = () => {
    onCloseModal();
    productListPrintBarCode.setSelectedRows([]);
  };
  const onChangeIsDefault = (value: CheckboxChangeEvent, idx: number) => {};
  const handlerSave = () => {
    form.submit();
  };
  const onSubmit = async (dataForm: any) => {
    UiUtils.setBusy();
    try {
      await DiscountBarCodeService.saveSettingBarCode({
        body: [...dataForm.items],
      });
      UiUtils.showSuccess(t("doneSettingBarcode"));
      handleCancel();
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  };
  const handleOk = () => {};
  const barcodeLayout_w = Form.useWatch("barcodeLayout", form);
  return (
    <>
      <Modal
        title={t("settingBarCode")}
        width={1000}
        style={{ top: 5 }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <Space wrap>
              <Button
                type={"primary"}
                onClick={handlerSave}
                icon={<SaveFilled />}
              >
                {t("save")}
              </Button>
              <ModalCloseBtn onClick={handleCancel} />
            </Space>
          </>
        }
      >
        <Form form={form} onFinish={onSubmit}>
          <Row gutter={12}>
            <Col span={12}>
              <FloatLabel label={t("barcodeLayout")}>
                <Form.Item name={["barcodeLayout"]}>
                  <OrdSelect
                    datasource={useSelectBarcodeLayoutType()}
                  ></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>
            {setting &&
              setting?.map((it, idx) => {
                return (
                  <>
                    <Col
                      span={24}
                      key={it.layoutType}
                      hidden={barcodeLayout_w != it.layoutType}
                    >
                      <Card
                        title={
                          <>
                            {t("printBarcodeTpl." + it.layoutType)}
                            <Form.Item
                              noStyle
                              name={["items", idx, "isDefault"]}
                              valuePropName="checked"
                              initialValue={true}
                            >
                              <Checkbox
                                className={"ms-3"}
                                onChange={(v) => onChangeIsDefault(v, idx)}
                              >
                                {t("barCodeSetting.IsDefault")}
                              </Checkbox>
                            </Form.Item>
                          </>
                        }
                      >
                        <SettingDiscountBarCodeForm index={idx} />
                      </Card>
                    </Col>
                  </>
                );
              })}
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SettingDiscountBarCodeModal;
