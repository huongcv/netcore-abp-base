import {Flex, Form, Modal, Switch} from "antd";
import * as React from "react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import FormItem from "antd/es/form/FormItem";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {ShopSettingDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {ShopSettingService} from "@api/ShopSettingService";
import {useStore} from "@ord-store/index";
import {SETTING_NAME_FOR_USER} from "@pages/System/ShopSetting/user-setting-name.const";
import {observer} from "mobx-react-lite";

const SaleInvoiceSetting = ()=>{
    const {sessionStore: sessionStore, invoiceSettingStore} = useStore();
    const {t} = useTranslation("shop-setting");
    const [cusForm] = Form.useForm();

    useEffect(() => {
        if (invoiceSettingStore.visibleSetting)
            cusForm.setFieldsValue(invoiceSettingStore.settings);
    }, [invoiceSettingStore.settings]);


    const handleOk = () => {
        cusForm.submit();
    };


    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                const input: ShopSettingDto[] = [];
                const formValues = cusForm.getFieldsValue();
                Object.keys(formValues).forEach((key) => {
                    const fieldValue = cusForm.getFieldValue(key as any);

                    let keyName = "";
                    const foundEntry = Object.entries(
                        SETTING_NAME_FOR_USER.saleInvoice
                    ).find(([formKey, _]) => formKey === key);

                    if (foundEntry) {
                        // @ts-ignore
                        keyName = foundEntry[1];
                    }

                    input.push({
                        id: "0",
                        name: keyName,
                        value: fieldValue?.toString() ?? "",
                        userId: sessionStore.userId ?? ""
                    });
                });

                await ShopSettingService.setListValue({
                    body: input,
                })
                    .then(() => {
                        handleCancel();
                        UiUtils.showSuccess(
                            t("updateSuccess", {
                                ...data,
                            }) as any
                        );
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);

                    })
                    .catch((e) => {
                        UiUtils.showError(t(e.response?.data?.error?.message));
                    });
            } catch (e) {
            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm();
        }
    };

    useHotkeys('F10', (event) => {
        event.preventDefault();
        handleCancel();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});

    useHotkeys('F8', (event) => {
        event.preventDefault();
        handleOk();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});

    function handleCancel() {
        invoiceSettingStore.setVisibleSetting(false);
        cusForm.resetFields();
    }

    return (
        <>
            <Modal title={"Cài đặt bán hàng"}
                   wrapClassName="modal-list"
                   open={invoiceSettingStore.visibleSetting}
                   width={600}
                   maskClosable={false}
                   style={{top: '30px'}}
                   onCancel={() => handleCancel()}
                   cancelText={t('close')}
                   footer={<FooterCrudModal onOk={() => {
                       handleOk()
                   }} onCancel={handleCancel}/>}
                   destroyOnClose>
                <Form form={cusForm} onFinish={saveData} className="my-[20px] flex flex-col gap-4">
                    <Flex style={{justifyContent: 'space-between'}}>
                        <div>Hiển thị hóa đơn vừa bán</div>
                        <FormItem noStyle={true} name="isOpenPopupDetail" valuePropName="checked">
                            <Switch/>
                        </FormItem>
                    </Flex>
                    <Flex style={{justifyContent: 'space-between'}}>
                        <div>Tự động in hóa đơn</div>
                        <FormItem noStyle={true} name="isPrintInvoice" valuePropName="checked">
                            <Switch/>
                        </FormItem>
                    </Flex>
                    <Flex style={{justifyContent: 'space-between'}}>
                        <div>Thanh toán bằng TingeeBox</div>
                        <FormItem noStyle={true} name="useQrCodeTingeeBox" valuePropName="checked">
                            <Switch/>
                        </FormItem>
                    </Flex>
                    {/*<Flex style={{justifyContent: 'space-between'}}>*/}
                    {/*    <div>Cache sản phẩm</div>*/}
                    {/*    <FormItem noStyle={true} name="useProductCache" valuePropName="checked">*/}
                    {/*        <Switch />*/}
                    {/*    </FormItem>*/}
                    {/*</Flex>*/}


                </Form>
            </Modal>

        </>
    );
}
export default observer(SaleInvoiceSetting);
