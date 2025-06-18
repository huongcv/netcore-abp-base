import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { ProfileIcon } from "@ord-components/icon/ProfileIcon";
import { Wallet2Icon } from "@ord-components/icon/Wallet2Icon";
import { WorkIcon } from "@ord-components/icon/WorkIcon";
import { HotKeyScope } from "@ord-core/AppConst";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { CustomerPayinfo } from "@pages/Partner/Shared/customer-payinfo";
import { DebtInfo } from "@pages/Partner/Shared/debtInfo";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  Modal,
  Tabs,
  TabsProps,
  Typography
} from "antd";
import { useWatch } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import { useEffect, useState } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import "../../Customer/ModalCruCustomer.scss";
import { PartnerSupplierEntityForm } from "./Forms/PartnerSupplierEntityForm";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const FormCustomerSupplierInfo = (props: {
  cusForm: FormInstance;
  disable: boolean;
}) => {
  const { t } = useTranslation(["customer-supplier"]);
  const { cusForm } = props;

  return (
    <>
      <Form form={cusForm} layout={"vertical"} disabled={props.disable}>
        <PartnerSupplierEntityForm />
      </Form>
    </>
  );
};
const ModalCruCustomerSupplier = (prop: { stored: CommonListStore<any> }) => {
  const { t: tCommon } = useTranslation([
    "common",
    "partner_transaction",
    "partner_debt",
    "customer-mbVoucher",
  ]); // Cho partner_transaction và debt vì bị nháy loag data lúc init lần đầu
  const { t } = useTranslation(["customer-supplier"]);
  const { stored: mainStore } = prop;
  const { createOrUpdateModal } = prop.stored;
  const [partnerId, setPartnerId] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [initData, setInitData] = useState<any>();
  const { supplierDebtStore: debtStore, partnerTransactionStore: transactionStore } = useStore();
  const [cusForm] = Form.useForm();

  const isActive = useWatch('isActive', cusForm);

  useEffect(() => {
    const { visible, entityData, mode } = mainStore.createOrUpdateModal;
    if (mode === 'addNew') {
      setDebtAmount(entityData?.debtAmount ?? 0);
      cusForm.setFieldsValue(mainStore.getInitModal().entityData);
      cusForm.setFieldValue('countryId', 2);
      cusForm.setFieldValue("isActive", true);
      setInitData(mainStore.getInitModal().entityData);
    } else if (mode === 'update' || mode === 'viewDetail') {
      setDebtAmount(entityData?.debtAmount ?? 0);
      setPartnerId(entityData?.id);
      cusForm.setFieldsValue(entityData);
      setInitData(entityData);
    }
  }, [mainStore.createOrUpdateModal.entityData])

  useHotkeys(
    "F8",
    (event) => {
      if (mainStore.createOrUpdateModal.visible) {
        onOkModal();
        event.preventDefault();
      }
    },
    { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
  );
  useHotkeys(
    "F10",
    (event) => {
      if (mainStore.createOrUpdateModal.visible) {
        prop.stored.closeModal();
        event.preventDefault();
      }
    },
    { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
  );
  const itemTab: TabsProps["items"] = [
    {
      icon: <ProfileIcon />,
      key: "1",
      label: t("customerInfo"),
      children: (
        <>
          <FormCustomerSupplierInfo
            disable={prop.stored.entityFormDisable}
            cusForm={cusForm}
          ></FormCustomerSupplierInfo>
        </>
      ),
    },
    {
      icon: <Wallet2Icon />,
      key: "2",
      label: t("transactionHistory"),
      disabled: partnerId == 0 || partnerId == undefined,
      children: <CustomerPayinfo partnerId={partnerId} store={transactionStore} partnerInfo={initData}
        type={2} debtStore={debtStore}></CustomerPayinfo>
    },
    {
      icon: <WorkIcon />,
      key: "3",
      disabled: partnerId == 0 || partnerId == undefined,
      label: t("debtInfo"),
      children: <DebtInfo partnerId={partnerId} store={debtStore} type={2}></DebtInfo>,
    },
  ];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  const extraTab: TabBarExtraContent = {
    left: (
      <div className={"text-center"}>
        <PartnerAvatar></PartnerAvatar>
        <Form form={cusForm} className="pt-3">
          <Form.Item name="isActived" className="mt-1" valuePropName="checked">
            <Checkbox>{t("isActived")}</Checkbox>
          </Form.Item>
          {debtAmount > 0 ? (
            <div className={"mb-2"}>
              <strong style={{ color: "orange" }}>Công nợ: </strong>
              <strong> {formatter.format(debtAmount)}</strong>
            </div>
          ) : (
            ""
          )}
        </Form>
      </div>
    ),
  };
  const onOkModal = async () => {
    try {
      const data = await cusForm.validateFields();

      UiUtils.setBusy();
      try {
        const isCreate = mainStore.createOrUpdateModal.mode === "addNew";
        const apiCru = isCreate
          ? mainStore.createEntity({
            ...data,
            isActived: true,
          })
          : mainStore.updateEntity({
            ...data,
            id: mainStore.createOrUpdateModal.entityData?.id,
          });
        await apiCru.then((result) => {
          if (result) {
            UiUtils.showSuccess(
              t(isCreate ? "addNewSuccess" : "updateSuccess", {
                ...data,
              }) as any
            );
            cusForm.resetFields();
            cusForm.setFieldsValue(prop.stored.getInitModal()?.entityData);
            mainStore.closeModal(true);
            fetchSyncDataPartners().then();
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
  return (
    <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
      {createOrUpdateModal.visible && (
        <Modal
          title={
            t("title." + createOrUpdateModal!.mode || "createOrUpdateModal", {
              ...createOrUpdateModal!.entityData,
            }) as any
          }
          open={createOrUpdateModal.visible}
          width={createOrUpdateModal.width || 550}
          maskClosable={false}
          style={{ top: "30px" }}
          onCancel={() => prop.stored.closeModal()}
          destroyOnClose
          footer={
            <FooterCrudModal
              // hasAddNewContinue={prop.stored.createOrUpdateModal.mode === 'addNew'}
              // isAddNewContinue={isAddNewContinue}
              // isAddNewContinueChange={(v) => setIsAddNewContinue(v)}
              hiddenOk={prop.stored.createOrUpdateModal.mode === "viewDetail"}
              onOk={onOkModal}
              onCancel={() => prop.stored.closeModal()}
            />
          }
        >
          <Tabs
            className={"tab-cru-customer"}
            tabBarExtraContent={extraTab}
            tabPosition={"left"}
            items={itemTab}
          ></Tabs>
        </Modal>
      )}
    </HotkeysProvider>
  );
};
export default observer(ModalCruCustomerSupplier);
