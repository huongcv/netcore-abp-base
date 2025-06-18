import { PARTNER_TYPE } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { ProfileIcon } from "@ord-components/icon/ProfileIcon";
import { WorkIcon } from "@ord-components/icon/WorkIcon";
import { HotKeyScope } from "@ord-core/AppConst";
import { CommonListStore } from "@ord-core/base/CommonListStore";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  Modal,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import { useEffect, useState } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import "../../Customer/ModalCruCustomer.scss";
import { PartnerDoctorEntityForm } from "./Forms/PartnerDoctorEntityForm";
import { FormDoctorPrescriptionHistory } from "./Forms/FormPrescriptionHistory";

const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const FormDoctorInfo = (props: {
  cusForm: FormInstance;
  disable: boolean;
  partnerType: PARTNER_TYPE;
}) => {
  const { t } = useTranslation(["partner-doctor"]);
  const { cusForm, partnerType } = props;
  const { partnerDoctorStore: mainStore } = useStore();
  return (
    <>
      <Form form={cusForm} layout={"vertical"} disabled={props.disable}>
        <PartnerDoctorEntityForm />
      </Form>
    </>
  );
};
// const FormPrescriptionHistory = (props: {
//   cusForm: FormInstance;
//   disable: boolean;
//   partnerType: PARTNER_TYPE;
// }) => {
//   const { t } = useTranslation(["partner-doctor"]);
//   const { cusForm, partnerType } = props;
//   const { partnerDoctorStore: mainStore } = useStore();
//   return (
//     <>
//       <Form form={cusForm} layout={"vertical"} disabled={props.disable}>
//         <FormDoctorPrescriptionHistory />
//       </Form>
//     </>
//   );
// };

const ModalCruDoctor = (prop: { stored: CommonListStore<any> }) => {
  const { t: tCommon } = useTranslation([
    "common",
    "partner_transaction",
    "partner_debt",
    "customer-mbVoucher",
  ]); // Cho partner_transaction và debt vì bị nháy loag data lúc init lần đầu
  const { t } = useTranslation(["partner-doctor"]);
  const { stored: mainStore } = prop;
  const { createOrUpdateModal } = prop.stored;
  const [partnerId, setPartnerId] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const [cusForm] = Form.useForm();

  useEffect(() => {
    const { visible, entityData, mode } = mainStore.createOrUpdateModal;
    if (mode === "addNew") {
      setPartnerId(0);
    } else {
      setDebtAmount(entityData?.debtAmount);
      setPartnerId(entityData?.id);
    }
  }, [mainStore.createOrUpdateModal.mode]);
  useEffect(() => {
    const { visible, entityData, mode } = mainStore.createOrUpdateModal;
    if (mode === "addNew") {
      cusForm.resetFields();
      cusForm.setFieldsValue(mainStore.getInitModal().entityData);
    } else if (mode === "update" || mode === "viewDetail") {
      cusForm.setFieldsValue(entityData);
    }
  }, [mainStore.createOrUpdateModal.entityData]);

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
          <FormDoctorInfo
            disable={prop.stored.entityFormDisable}
            cusForm={cusForm}
            partnerType={6}
          ></FormDoctorInfo>
        </>
      ),
    },
    {
      icon: <WorkIcon />,
      key: "2",
      label: t("prescriptionHistory"),
      disabled: partnerId == 0 || partnerId == undefined,
      children: <><FormDoctorPrescriptionHistory partnerId={partnerId} store={mainStore} /></>,
    },
  ];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  const extraTab: TabBarExtraContent = {
    left: (
      <div className={"text-center"}>
        <PartnerAvatar></PartnerAvatar>
        <Form form={cusForm} className="pt-3">
          <Form.Item className="mt-1" name="isActived" valuePropName="checked">
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

      const isCreate = mainStore.createOrUpdateModal.mode === "addNew";

      const apiCru = isCreate
        ? mainStore.createEntity({ ...data, isActived: true })
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
    } catch (error) {
      console.error("Lỗi khi xử lý form:", error);
      UiUtils.showError("Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      UiUtils.clearBusy();
    }
  };

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
export default observer(ModalCruDoctor);
