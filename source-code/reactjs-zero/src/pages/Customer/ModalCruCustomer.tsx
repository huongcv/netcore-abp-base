import { GifOutlined, GiftFilled, GiftOutlined } from "@ant-design/icons";
import { PartnerDto } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { Discount2Icon } from "@ord-components/icon/Discount2Icon";
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
import { LoyaltyTierInfo } from "@pages/Partner/Shared/loyaltyTierInfo";
import { LoyaltyTransactionInfo } from "@pages/Partner/Shared/loyaltyTransactionInfo";
import PartnerAvatar from "@pages/Partner/Shared/PartnerAvatar";
import {
    Checkbox,
    Form,
    FormInstance,
    Input,
    Modal, Spin,
    Tabs,
    TabsProps,
    Typography
} from "antd";
import { observer } from "mobx-react-lite";
import { TabBarExtraContent } from "rc-tabs/lib/interface";
import { useEffect, useState } from "react";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { PartnerCustomerEntityForm } from "./Form/PartnerCustomerEntityForm";
import "./ModalCruCustomer.scss";
import PartnerClassWithAvatar from "@pages/Partner/Shared/PartnerClassWithAvatar";
import { useWatch } from "antd/es/form/Form";
import { MembershipIcon } from "@ord-components/icon/MembershipIcon";
import { WalletIcon } from "@ord-components/icon/WalletIcon";
import { PointAccumulationIcon } from "@ord-components/icon/PointAccumulationIcon";
const { Paragraph, Text } = Typography;
const { TextArea } = Input;

const ModalCruCustomer = (prop: {
    stored: CommonListStore<any>;
    onNewCusSelected?: (newCustomer: PartnerDto) => void;
}) => {
    const { t: tCommon } = useTranslation([
        "common",
        "partner_transaction",
        "partner_debt",
        "customer-mbVoucher",
    ]); // Cho partner_transaction và debt vì bị nháy loag data lúc init lần đầu
    const { t } = useTranslation(["customer"]);
    const { generalInfoSettingStore: settingStore } = useStore();
    const { stored: mainStore } = prop;
    const { createOrUpdateModal } = prop.stored;
    const [partnerId, setPartnerId] = useState<number>(0);
    const [debtAmount, setDebtAmount] = useState<number>(0);
    const [partnerClass, setPartnerClass] = useState<string>("Member");
    const [cusForm] = Form.useForm();
    const [initData, setInitData] = useState<any>();
    const { partnerTransactionStore: transactionStore, customerDebtStore: debtStore } = useStore();

    useEffect(() => {
        const { visible, entityData, mode } = mainStore.createOrUpdateModal;
        if(visible){
            settingStore.getSettingInfo()
        }
        if (mode === 'addNew') {
            if(mainStore.createOrUpdateModal.entityData){
                cusForm.setFieldsValue(mainStore.createOrUpdateModal.entityData);
            }else{
                cusForm.resetFields();
                setPartnerId(0);
                setDebtAmount(entityData?.debtAmount ?? 0);
                cusForm.setFieldsValue(mainStore.getInitModal().entityData);
                cusForm.setFieldValue('countryId', 2);
                cusForm.setFieldValue("isActive", true);
                setInitData(mainStore.getInitModal().entityData);
            }
        } else if (mode === 'update' || mode === 'viewDetail') {
            cusForm.setFieldsValue(entityData);
            setDebtAmount(entityData?.debtAmount ?? 0);
            setPartnerId(entityData?.id);
            setInitData(entityData);
            setPartnerClass(entityData?.loyaltyCode);
        }

    }, [mainStore.createOrUpdateModal.entityData])
    useHotkeys(
        "F8",
        (event) => {
            if (mainStore.createOrUpdateModal.visible && cusForm) {
                onOkModal();
                event.preventDefault();
            }

        },
        { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
    );
    useHotkeys(
        "F10",
        (event) => {
            if (mainStore.createOrUpdateModal.visible && cusForm) {
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
                    <FormCustomerInfo
                        cusForm={cusForm}
                        disable={createOrUpdateModal.mode === "viewDetail"}
                    ></FormCustomerInfo>
                </>
            ),
        },
        {
            icon: <Wallet2Icon />,
            key: "2",
            label: t("transactionHistory"),
            disabled: partnerId == 0 || partnerId == undefined,

            children: (
                <CustomerPayinfo
                    store={transactionStore} partnerInfo={initData}
                    useHotKey={true} type={1} debtStore={debtStore}
                    partnerId={partnerId}

                ></CustomerPayinfo>
            ),
        },
        {
            icon: <WorkIcon />,
            key: "3",
            disabled: partnerId == 0 || partnerId == undefined,
            label: t("debtInfo"),
            children: <DebtInfo partnerId={partnerId} store={debtStore} type={1}></DebtInfo>,
        },
        {
            icon: <MembershipIcon />,
            key: "4",
            disabled: partnerId == 0 || partnerId == undefined,
            label: t("membershipInfo"),
            children: <LoyaltyTierInfo partnerId={partnerId}></LoyaltyTierInfo>,

        },
        {
            icon: <Discount2Icon />,
            key: "5",
            disabled: partnerId == 0 || partnerId == undefined,
            label: t("loyaltyInfo"),
            children: <LoyaltyTransactionInfo partnerId={partnerId}></LoyaltyTransactionInfo>,
        }
    ];
    const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    const extraTab: TabBarExtraContent = {
        left: (
            <div className={"text-center"}>
                <PartnerClassWithAvatar partnerClass={partnerClass} isActive={useWatch('isActived', cusForm)}></PartnerClassWithAvatar>
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
            try {
                const isCreate = mainStore.createOrUpdateModal.mode === "addNew";
                const apiCru = isCreate
                    ? mainStore.createEntity({
                        ...data,
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
                        if (prop.onNewCusSelected) {
                            prop.onNewCusSelected(mainStore.createOrUpdateEntitySaved);
                        }
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
                <Spin spinning={settingStore.loadingSetting}>
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
                </Spin>

            )}
        </HotkeysProvider>
    );
};
export default observer(ModalCruCustomer);

//#region Form Thông tin khách hàng
const FormCustomerInfo = (props: {
    cusForm: FormInstance;
    disable: boolean;
}) => {
    const { t } = useTranslation("customer");
    const { cusForm } = props;
    return (
        <>
            <Form form={cusForm} layout={"vertical"} disabled={props.disable}>
                <PartnerCustomerEntityForm />
            </Form>
        </>
    );
};
//#endregion

