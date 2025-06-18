import {GolfCustomerDto} from "@api/index.defs";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {ProfileIcon} from "@ord-components/icon/ProfileIcon";
import {Wallet2Icon} from "@ord-components/icon/Wallet2Icon";
import {HotKeyScope} from "@ord-core/AppConst";
import {fetchSyncDataPartners} from "@ord-core/db/services/syncDataPartners";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {CustomerPayinfo} from "@pages/Partner/Shared/customer-payinfo";
import {LoyaltyTierInfo} from "@pages/Partner/Shared/loyaltyTierInfo";
import {
    Checkbox,
    Form,
    FormInstance,
    Input,
    Modal,
    Spin,
    Tabs,
    TabsProps,
    Typography
} from "antd";
import {observer} from "mobx-react-lite";
import {TabBarExtraContent} from "rc-tabs/lib/interface";
import {lazy, Suspense, useEffect, useState} from "react";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import "./ModalCruCustomer.scss";
import PartnerClassWithAvatar from "@pages/Partner/Shared/PartnerClassWithAvatar";
import {useWatch} from "antd/es/form/Form";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {PartnerAccessCardTable} from "./ModalAccessCardManage";
import CustomerStore from "@ord-store/Golf/Customer/customerStateStore";
import {PartnerCustomerEntityForm} from "@pages/Customer/Form/PartnerCustomerEntityForm";

const {Paragraph, Text} = Typography;
const {TextArea} = Input;

const ModalCruCustomer = (prop: {
    stored: CustomerStore;
    isCustomerGolf?: boolean;
    onNewCusSelected?: (newCustomer: GolfCustomerDto) => void;
    requiredPhone?: boolean;
    onModalCancel?: () => void;
}) => {
    const {t: tCommon} = useTranslation([
        "common",
        "partner_transaction",
        "partner_debt",
        "customer-mbVoucher",
    ]);
    const {t} = useTranslation(["golf-customer"]);
    const {stored: mainStore} = prop;
    const {createOrUpdateModal} = prop.stored;
    const [partnerId, setPartnerId] = useState<number>(0);
    const [debtAmount, setDebtAmount] = useState<number>(0);
    const [partnerClass, setPartnerClass] = useState<string>("Member");
    const [cusForm] = Form.useForm();
    const [initData, setInitData] = useState<any>();
    const {partnerTransactionStore: transactionStore, customerDebtStore: debtStore} = useStore();

    useEffect(() => {
        const {visible, entityData, mode} = mainStore.createOrUpdateModal;
        if (mode === 'addNew') {
            cusForm.resetFields();
            setPartnerId(0);
            setDebtAmount(entityData?.debtAmount ?? 0);
            cusForm.setFieldsValue(mainStore.getInitModal().entityData);
            cusForm.setFieldValue('countryId', 2);
            cusForm.setFieldValue("isActive", true);
            setInitData(mainStore.getInitModal().entityData);
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
        {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
    );
    useHotkeys(
        "F10",
        (event) => {
            if (mainStore.createOrUpdateModal.visible && cusForm) {
                prop.stored.closeModal();
                event.preventDefault();
            }
        },
        {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
    );
    useEffect(() => {
        if(!mainStore.createOrUpdateModal.visible && prop.onModalCancel){
            prop.onModalCancel();
        }
    }, [mainStore.createOrUpdateModal.visible]);

    const itemTab: TabsProps["items"] = [
        {
            icon: <ProfileIcon/>,
            key: "1",
            label: t("customerInfo"),
            children: (
                <>
                    <FormCustomerInfo
                        cusForm={cusForm}
                        requiredPhone={prop.requiredPhone}
                        isCustomerGolf={prop.isCustomerGolf}
                        disable={createOrUpdateModal.mode === "viewDetail"}
                    ></FormCustomerInfo>
                </>
            ),
        },
        {
            icon: <Wallet2Icon/>,
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
            icon: <IconlyLight type="money.svg"/>,
            key: "3",
            disabled: partnerId == 0 || partnerId == undefined,
            label: t("debtInfo"),
            children: <LoyaltyTierInfo partnerId={partnerId}></LoyaltyTierInfo>,

        },
        {
            icon: <IconlyLight type="ticket-star.svg"/>,
            key: "4",
            disabled: partnerId == 0 || partnerId == undefined,
            label: t("memberShipCard"),
            children: <>
                <PartnerAccessCardTable partnerId={partnerId} stored={mainStore} isView={true}/>
            </>,
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
                <PartnerClassWithAvatar partnerClass={partnerClass}
                                        isActive={useWatch('isActived', cusForm)}></PartnerClassWithAvatar>
                <Form form={cusForm} className="pt-3">
                    <Form.Item className="mt-1" name="isActived" valuePropName="checked">
                        <Checkbox>{t("isActived")}</Checkbox>
                    </Form.Item>

                    {debtAmount > 0 ? (
                        <div className={"mb-2"}>
                            <strong style={{color: "orange"}}>Công nợ: </strong>
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

    const LazyModalMemberShipCard = lazy(
        () => import("../Form/ModalMemberShipCard")
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
                    style={{top: "30px"}}
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
            )}
            <Suspense fallback={<Spin/>}>
                {prop.stored.updateMemberShipCardModel.visible && (
                    <LazyModalMemberShipCard stored={prop.stored} partnerId={partnerId}></LazyModalMemberShipCard>
                )}
            </Suspense>
        </HotkeysProvider>
    );
};
export default observer(ModalCruCustomer);

//#region Form Thông tin khách hàng
const FormCustomerInfo = (props: {
    cusForm: FormInstance;
    isCustomerGolf?: boolean;
    requiredPhone?: boolean;
    disable: boolean;
}) => {
    const {t} = useTranslation("customer");
    const {cusForm, requiredPhone=false, isCustomerGolf = true} = props;
    return (
        <>
            <Form form={cusForm} layout={"vertical"} disabled={props.disable}>
                <PartnerCustomerEntityForm requiredPhone={requiredPhone}/>
            </Form>
        </>
    );
};
//#endregion

