import {Alert, Button, Form, FormInstance, Input, Space} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";
import {useStore} from "@ord-store/index";
import ModalCruCustomer from "@pages/Customer/ModalCruCustomer";
import {CustomerService} from "@api/CustomerService";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {CustomerSelectSearchGolfApi} from "@pages/SalesInvoice/Form/customerSelectGolfSearchApi";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {PARTNER_PER} from "@ord-core/config/permissions/partner.permission";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";


export interface CustomerDebtAmount {
    DebtAmount: number;
}

export const CustomerSelectForm = (props: {
    form: FormInstance;
    usingPartnerObj?: boolean;
}) => {
    const {
        customerStore: customerStore,
        sessionStore
    } = useStore();
    const customerId_w = Form.useWatch("partnerId", props.form);
    const [showDebtAmount, setShowDebtAmount] =
        React.useState<CustomerDebtAmount>();
    const formatterNumber = Utils.formatterNumber;
    const isShowDropdownPartner = checkPermissionUser(sessionStore.appSession, PARTNER_PER.viewCustomerList);
    const {t} = useTranslation(customerStore.getNamespaceLocale());

    // nhằm mục đích check xem có phải là form tạo phiếu trả hàng không
    // nếu là form tạo phiếu trả hàng thì không cho chọn khách hàng khác
    const relatedInvoiceId_w = Form.useWatch("relatedInvoiceId", props.form);

    const onSelect = (option: any) => {
        if (option) {
            CustomerService.getById({findId: Number(option.id)}).then((rsp) => {
                if (rsp) {
                    if (rsp?.debtAmount && rsp.debtAmount > 0) {
                        setShowDebtAmount({
                            DebtAmount: rsp.debtAmount,
                        } as CustomerDebtAmount);
                    }

                    if (rsp?.groupDiscountPercent && rsp.groupDiscountPercent > 0) {
                        props.form.setFieldValue("groupDiscountPercent", rsp.groupDiscountPercent);
                        props.form.setFieldValue("isGroupDiscountPercent", true);
                        props.form.setFieldValue("discountType", DiscountTypeEnum.Percent);
                        props.form.setFieldValue("discountPercent", rsp.groupDiscountPercent);
                        props.form.setFieldValue("discountInput", rsp.groupDiscountPercent);
                        discountInputChange();
                    }
                }
            });
        } else {
            setShowDebtAmount({
                DebtAmount: 0,
            } as CustomerDebtAmount);

            resetDiscount();
        }
        props.form.setFieldValue("partnerId", option.id);
        if (props.usingPartnerObj) props.form.setFieldValue("partnerObj", option);
    };

    const removeCustomerSelect = () => {
        // setCustomer(undefined)
        setShowDebtAmount({
            DebtAmount: 0,
        } as CustomerDebtAmount);

        resetDiscount();

        props.form.setFieldValue("partnerId", "");
        if (props.usingPartnerObj) props.form.setFieldValue("partnerObj", null);
    };

    const resetDiscount = () => {
        props.form.setFieldValue("groupDiscountPercent", 0);
        props.form.setFieldValue("isGroupDiscountPercent", false);
        props.form.setFieldValue("discountType", DiscountTypeEnum.Percent);
        props.form.setFieldValue("discountPercent", 0);
        props.form.setFieldValue("discountInput", 0);
        props.form.setFieldValue("discountAmount", 0);
        props.form.setFieldValue("taxDiscountPercent", 0);
        props.form.setFieldValue("taxDiscountAmount", 0);
    }

    const discountInputChange = () => {
        const values = props.form.getFieldsValue();
        const totalAmountBeforeDiscount = values.totalAmountBeforeDiscount || 0;
        const taxDiscountPercent = values.taxDiscountPercent || 0;
        const type = values.discountType || DiscountTypeEnum.Percent;

        const discountAmount = type === DiscountTypeEnum.Value ? values.discountInput : 0;
        const discountPercent = type === DiscountTypeEnum.Percent ? values.discountInput : 0;

        const calculatorDiscount =
            CalculatorCurrencyUtil.calculateDiscount(type, discountPercent, discountAmount, totalAmountBeforeDiscount);
        const taxDiscountAmount =
            CalculatorCurrencyUtil.summaryTaxDiscountAmount(calculatorDiscount.discountAmount, taxDiscountPercent);

        props.form.setFieldsValue({
            discountPercent: calculatorDiscount.discountPercent,
            discountAmount: calculatorDiscount.discountAmount,
            discountType: type,
            taxDiscountAmount: taxDiscountAmount
        })
    }

    return (
        <>
            {/*<Form.Item name="partnerName" hidden><Input/></Form.Item>*/}
            <Space.Compact style={{width: "100%", marginBottom: 2, marginTop: 8}}>
                <Form.Item
                    name="partnerId"
                    style={{width: relatedInvoiceId_w ? "100%" : "93%"}}
                >
                    {/*<CustomerSelectSearchApi*/}
                    {/*  disabled={customerId_w || relatedInvoiceId_w}*/}
                    {/*  onCustomerSelected={onSelect}*/}
                    {/*></CustomerSelectSearchApi>*/}

                    <CustomerSelectSearchGolfApi
                        usingQrSearch={sessionStore.isGolfTenant}
                        // open={isShowDropdownPartner || !sessionStore.isGolfTenant}
                        open={isShowDropdownPartner} // có quyền xem danh sách khách hàng thì sẽ showDropdown chọn
                        disabled={customerId_w || relatedInvoiceId_w}
                        onCustomerSelected={onSelect}
                        callBackCheckCard={(data) => {
                            customerStore.openCreateModal({
                                gender: data.gender,
                                name: data.fullName,
                                dateOfBirth: data.dateOfBirth,
                                address: data.permanentAddress,
                                code: data.nationalId,
                                cityCode: data.cityCode,
                                districtCode: data.districtCode,
                                wardCode: data.wardCode,
                            })
                        }}
                    ></CustomerSelectSearchGolfApi>

                </Form.Item>
                {props.usingPartnerObj && (
                    <Form.Item hidden noStyle name="partnerObj" style={{width: "100%"}}>
                        <Input></Input>
                    </Form.Item>
                )}

                {relatedInvoiceId_w ? (
                    <></>
                ) : customerId_w ? (
                    <Button
                        onClick={removeCustomerSelect}
                        size="large"
                        className="border-l-0 rounded-md"
                    >
                        <CloseOutlined/>
                    </Button>
                ) : (
                    <Button
                        onClick={() => customerStore.openCreateModal()}
                        size="large"
                        className="border-l-0 rounded-md bg-gray-100"
                    >
                        <PlusOutlined/>
                    </Button>
                )}
            </Space.Compact>
            {customerId_w && showDebtAmount && showDebtAmount.DebtAmount > 0 ? (
                <Alert
                    message={`${t("customerDebtAmount")} ${formatterNumber(
                        showDebtAmount?.DebtAmount, 0
                    )}`}
                    type="warning"
                    showIcon
                />
            ) : (
                <></>
            )}
            <ModalCruCustomer
                stored={customerStore}
                onNewCusSelected={(item) => {
                    if (item.isActived) {
                        props.form.setFieldValue("partnerId", item.id);
                        if (props.usingPartnerObj)
                            props.form.setFieldValue("partnerObj", item);

                        if (item?.groupDiscountPercent && item.groupDiscountPercent > 0) {
                            props.form.setFieldValue("groupDiscountPercent", item.groupDiscountPercent);
                            props.form.setFieldValue("isGroupDiscountPercent", true);
                            props.form.setFieldValue("discountType", DiscountTypeEnum.Percent);
                            props.form.setFieldValue("discountPercent", item.groupDiscountPercent);
                            props.form.setFieldValue("discountInput", item.groupDiscountPercent);
                            discountInputChange();
                        }
                    }
                }}
            ></ModalCruCustomer>
        </>
    );
};
