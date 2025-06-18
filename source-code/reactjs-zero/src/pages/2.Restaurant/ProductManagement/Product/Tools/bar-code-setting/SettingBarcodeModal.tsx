import { Button, Card, Checkbox, Col, Form, Modal, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import { SaveFilled } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { ProductBarcodeService } from "@api/ProductBarcodeService";
import { ProductBarCodeLayoutSettingDto } from "@api/index.defs";
import { SettingBarcodeItemLayoutForm } from "@pages/ProductManagement/Product/Tools/bar-code-setting/SettingBarcodeItemLayoutForm";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useSelectBarcodeLayoutType } from "@ord-components/forms/select/selectDataSource/useSelectBarcodeLayoutType";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

const SettingBarcodeModal = (props: {
  isModalOpen: boolean;
  onCloseModal: () => void;
}) => {
  const { sessionStore } = useStore();
  const [t] = useTranslation("product");
  const { productListPrintBarCode } = useStore();
  const { isModalOpen, onCloseModal } = props;
  const [form] = Form.useForm();
  const [setting, setSetting] = useState<ProductBarCodeLayoutSettingDto[]>();
  const handleOk = () => {};
  const getSetting = async () => {
    UiUtils.setBusy();
    try {
      const items = await ProductBarcodeService.getSetting({
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
  useEffect(() => {
    if (!!props.isModalOpen) {
      getSetting().then();
    }
  }, [props.isModalOpen]);

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
      await ProductBarcodeService.saveSettingBarcode({
        body: [...dataForm.items],
      });
      UiUtils.showSuccess(t("doneSettingBarcode"));
      handleCancel();
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  };
  const barcodeLayout_w = Form.useWatch("barcodeLayout", form);
  return (
    <>
      <Modal
        title={t("settingBarCode")}
        width={1100}
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
                        <SettingBarcodeItemLayoutForm index={idx} />
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
export default observer(SettingBarcodeModal);
