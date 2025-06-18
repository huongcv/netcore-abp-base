import { useTranslation } from "react-i18next";
import { Button, Checkbox, Col, Form, Input, Row, Switch, Tooltip } from "antd";
import React, { useEffect } from "react";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TextArea from "antd/lib/input/TextArea";
import UiUtils from "@ord-core/utils/ui.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import { PartnerDto, ShopBankAccountDto } from "@api/index.defs";
import { CommonResultDto } from "@ord-core/service-proxies/dto";
import { OrdSelectAndAddNew } from "@ord-components/forms/select/OrdSelectAndAddNew";
import { ShopBankAccountService } from "@api/ShopBankAccountService";
import {
  BankAccountLabel,
  BankAccountRenderSelectItem,
  useSelectShopBankAccount,
} from "@ord-components/forms/select/selectDataSource/useSelectShopBankAccount";
import { ReloadOutlined } from "@ant-design/icons";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBank } from "@ord-components/forms/select/selectDataSource/useSelectBank";
import { VietQrService } from "@api/VietQrService";
import { useStore } from "@ord-store/index";
import utils from "@ord-core/utils/utils";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

const keyShopBankAccount = `ShopBankAccount`;

const ShopBankAccountInput = (props: any) => {
  const { onChange } = props;
  const [t] = useTranslation("sale-invoice");
  const select_Ds = useSelectShopBankAccount();
  const { selectDataSourceStore } = useStore();
  const form = Form.useFormInstance();
  const apiSave = async (formValue: any) => {
    UiUtils.setBusy();
    try {
      const result = await ShopBankAccountService.createOrUpdate({
        body: {
          ...formValue,
        },
      });
      if (result.isSuccessful) {
        UiUtils.showSuccess(
          t("addNewShopBankAccountSuccess", {
            ...result.data,
          }) as any
        );
        clearDatasource();
      } else {
        ServiceProxyUtils.notifyErrorResultApi(result, "sale-invoice", {
          ...formValue,
        });
      }
      return result;
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
    return {
      isSuccessful: false,
    } as CommonResultDto<any>;
  };
  const clearDatasource = () => {
    selectDataSourceStore.clearByName(keyShopBankAccount);
    selectDataSourceStore.getOptions(keyShopBankAccount, async () => {
      const result = await ShopBankAccountService.getComboOptions();
      return utils.mapCommonSelectOption(result);
    });
  };
  const handlerDoneAdd = (value: PartnerDto) => {
    if (value) {
      onChange(value.id, value);
    }
  };

  useEffect(() => {
    const shopBankAccountId = form.getFieldValue('shopBankAccountId');
    if (!shopBankAccountId) {
      const data = select_Ds.data.find(item => item.data?.isDefault)?.data;
      if (data) {
        form.setFieldValue('shopBankAccountId', data.id)
        form.setFieldValue('bankCode', data.bankCode);
        form.setFieldValue('bankAccountCode', data.accountCode);
        form.setFieldValue('bankAccountName', data.accountName);
        form.setFieldValue('bankVirtualCode', data.virtualUserName);
      }
    }
  }, [Form.useWatch('shopBankAccountId'), select_Ds.data])

  return (
    <>
      <OrdSelectAndAddNew
        {...props}
        formContent={<FormContent />}
        apiAddNew={apiSave}
        nameDataSource={keyShopBankAccount}
        renderSelectOptions={BankAccountRenderSelectItem}
        optionRender={(option: any) => (
          <BankAccountLabel dto={option.data?.data} />
        )}
        datasource={select_Ds}
        placeholder="-Tài khoản nhận-"
        modalSetting={{
          width: 600,
        }}
        onAddDone={handlerDoneAdd}
      />
    </>
  );
};
export default ShopBankAccountInput;

const FormContent = () => {
  const [t] = useTranslation("bankAccount");
  const [tCommon] = useTranslation();
  const form = Form.useFormInstance();

  useEffect(() => {
    if (form) {
      form.setFieldsValue({ isActived: true });
    }
  }, [form]);

  const bankOptions = {
    data: useSelectBank().data.map((bank: any) => ({
      value: bank.data.nameOther,
      label: bank.data.name,
    })),
    isPending: false,
  };

  const reloadQRStatic = async () => {
    try {
      const data = await form.validateFields();
      UiUtils.setBusy();
      try {
        VietQrService.genStaticQr({
          body: {
            bankcode: data.bankCode,
            sotk: data.virtualUserName ?? data.accountCode,
            tentk: data.accountName,
          },
        }).then((res) => {
          if (res.isSuccessful) {
            form.setFieldValue("qrCodeStatic", res.data);
          } else {
            UiUtils.showError(res.notification?.message);
          }
        });
      } catch (e) {
      } finally {
        UiUtils.clearBusy();
      }
    } catch (errorInfo) {
      UiUtils.showCommonValidateForm();
    }
  };

  const focusRef = useAutoFocus();
  return (
    <>
      <Col span={18}>
        <FloatLabel label={t("bankCode")} required>
          <Form.Item name="bankCode" rules={[ValidateUtils.required]}>
            <OrdSelect
              datasource={bankOptions}
              allowClear
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={6}>
        <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
          <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
        </Form.Item>
      </Col>
      <Col span={8}>
        <FloatLabel label={t("accountCode")} required>
          <Form.Item name="accountCode" rules={[ValidateUtils.required]}>
            <Input ref={focusRef} />
          </Form.Item>
        </FloatLabel>
      </Col>
      <Col span={16}>
        <FloatLabel label={t("accountName")} required>
          <Form.Item name="accountName" rules={[ValidateUtils.required]}>
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>

      <Col span={8}>
        <FloatLabel label={t("virtualUserName")}>
          <Form.Item name="virtualUserName">
            <Input />
          </Form.Item>
        </FloatLabel>
      </Col>

      <Col span={16}>
        <FloatLabel label={t("qrCodeStatic")}>
          <Form.Item name="qrCodeStatic">
            <Input
              addonAfter={
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={reloadQRStatic}
                />
              }
            />
          </Form.Item>
        </FloatLabel>
      </Col>

      <Col span={24}>
        <FloatLabel label={t("notes")}>
          <Form.Item name="notes">
            <TextArea />
          </Form.Item>
        </FloatLabel>
      </Col>

      <Form.Item hidden name='bankAccountCode' />
      <Form.Item hidden name='bankAccountName' />
      <Form.Item hidden name='bankVirtualCode' />
    </>
  );
};
