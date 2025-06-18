import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {HotKeyScope} from "@ord-core/AppConst";
import uiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import "@pages/2.Restaurant/CentralBilling/index.scss";
import "@pages/Order/index.scss";
import {Col, Form, Modal, Row} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import GridProductItems from "../Utils/GridProductItems";
import RightBox from "../Utils/RightBox";
import UiUtils from "@ord-core/utils/ui.utils";
import {SaleInvoiceDto} from "@api/index.defs";
import {PaymentMethodEnum} from "@pages/2.Restaurant/CentralBilling/Utils/PaymentMethod";

declare var ord: any;

const CheckoutModalForm = () => {
    const {t} = useTranslation("order");
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const {
        paymentCentralBillingStore,
        golfCheckInOutStore,
        saleInvoiceStore,
        sessionStore,
        invoiceSettingStore
    } = useStore();
    const {
        partnerId,
        mainInvoiceId,
        customSave
    } = paymentCentralBillingStore.createOrUpdateModal.entityData ?? {};
    const {settings} = invoiceSettingStore;

    const handleSave = async () => {
        const data = await form.validateFields();
        const productItems = formProductItems.getFieldValue('saleInvoiceDetails');
        if (customSave) {
            customSave({
                ...data,
                saleInvoiceDetails: productItems,
            }, async (data: SaleInvoiceDto) => {

                if (settings.isOpenPopupDetail) {
                    saleInvoiceStore.openViewInvoiceModal(data);
                }
                if (settings.useQrCodeTingeeBox) {
                    await checkAndShowQrCode(data);
                }
                onCancel();
            });
        } else {

            uiUtils.setBusy()
            SaleInvoiceService.create({
                body: {
                    ...data,
                    saleInvoiceDetails: formProductItems.getFieldValue('saleInvoiceDetails'),
                    status: 4,
                    paymentStatus: 2
                }
            }).then(async res => {
                if (res.isSuccessful && res.data && res.data.id) {
                    uiUtils.clearBusy();

                    uiUtils.showSuccess("Checkout thành công");
                    if (settings.isOpenPopupDetail) {
                        saleInvoiceStore.openViewInvoiceModal(res.data);
                    }
                    if (settings.useQrCodeTingeeBox) {
                        await checkAndShowQrCode(res.data);
                    }
                    onCancel();
                } else {
                }
            }).finally(() => {
                uiUtils.clearBusy();
            })
        }
    };


    useHotkeys(
        "f10",
        (event) => {
            event.preventDefault();
            navigate(-1);
        },
        {
            scopes: [HotKeyScope.crudPageBase],
            enableOnFormTags: true,
        }
    );

    const triggerDirty = () => {
        ord.event.trigger("event@dirty.stock", true);
    };

    const onCancel = () => {
        paymentCentralBillingStore.createOrUpdateModal.visible = false;
    };
    // #region QrCode
    const checkQrBoxAvailable = async () => {
        try {
            // @ts-ignore
            let ports = await navigator.serial.getPorts();

            if (ports.length === 0) {
                try {
                    // @ts-ignore
                    const p = await navigator.serial.requestPort();
                    ports.push(p);
                    if (p) {
                        ports.push(p);
                    }
                    return true;
                } catch (error) {
                    UiUtils.showError("Vui lòng chọn máy hiển thị QR");
                }
            } else if (ports.length > 0) {
                return true;
            }
        } catch (error) {
            UiUtils.showError("Vui lòng chọn máy hiển thị QR");
        }
        return false;
    };
    const getQrCode = async (input: SaleInvoiceDto) => {
        const resQr = await SaleInvoiceService.getQrSaleOrder({
            body: {
                deviceTokenId: sessionStore.firebaseToken,
                invoiceCode: input.invoiceCode,
                invoiceId: input.id,
                shopBankAccountId: input.shopBankAccountId,
                totalAmount: input.paymentAmount,
            },
        });
        if (resQr.isSuccessful && resQr.data?.qrCode) {
            await showQrCodeToBox(resQr.data.qrCode);
            // UiUtils.showSuccess(t("pleaseCheckQr"));
        } else UiUtils.showError("ErrorGetQRTingee");
    };
    const showQrCodeToBox = async (qrCode: string) => {
        // @ts-ignore
        if (!navigator.serial) {
            UiUtils.showError(
                "Trình duyệt không hỗ trợ kết nối với thiết bị này. Vui lòng nâng cấp phiên bản trình duyệt mới nhất."
            );
            return false;
        }

        // @ts-ignore
        let ports = await navigator.serial.getPorts();
        if (ports.length == 0) {
            // @ts-ignore
            const p = await navigator.serial.requestPort();
            ports.push(p);
        }
        for (let port of ports) {
            await port.open({baudRate: 9600});
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            const writer = textEncoder.writable.getWriter();
            let data = "AT+QR_DISPLAY=100," + qrCode + "\r\n";
            await writer.write(data);
            writer.close();
            await writableStreamClosed;

            await port.close();
        }
    };
    const checkAndShowQrCode = async (saleInvoice: SaleInvoiceDto) => {
        if (saleInvoice.paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN && saleInvoice.shopBankAccountId) {
            try {
                const available = await checkQrBoxAvailable();
                if (available) {
                    await getQrCode(saleInvoice);
                }
            } catch (error) {
                UiUtils.showInfo("CantCreateQrCode")
            }
        }
    }
    /// #endregion End QRCde

    useEffect(() => {
        if (paymentCentralBillingStore.createOrUpdateModal.visible) {
            uiUtils.setBusy();
            SaleInvoiceService.getInvoiceCentralBilling({
                body: {
                    partnerId: paymentCentralBillingStore.createOrUpdateModal.entityData?.partnerId,
                    listInvoiceId: paymentCentralBillingStore.createOrUpdateModal.entityData?.listInvoiceId,
                    mainInvoiceId: paymentCentralBillingStore.createOrUpdateModal.entityData?.mainInvoiceId,

                }
            })
                .then((res) => {
                    uiUtils.clearBusy();
                    formProductItems.setFieldValue("saleInvoiceDetails", res.saleInvoiceDetails);
                    form.setFieldsValue(res);
                    form.setFieldValue('fetchData', true);
                    form.setFieldValue("partnerName", paymentCentralBillingStore.createOrUpdateModal.entityData?.partnerName ?? "Khách lẻ");
                    form.setFieldValue("partnerId", paymentCentralBillingStore.createOrUpdateModal.entityData?.partnerId);
                    form.setFieldValue("paymentMethod", PaymentMethodEnum.TIEN_MAT);
                })
                .catch(() => {
                    formProductItems.setFieldValue("saleInvoiceDetails", null);
                    form.setFieldValue('fetchData', true);
                })
                .finally(() => {
                    uiUtils.clearBusy();
                });
        }

    }, [paymentCentralBillingStore.createOrUpdateModal.visible]);

    return (
        <Modal
            width={"90%"}
            open={paymentCentralBillingStore.createOrUpdateModal.visible}
            onCancel={() => onCancel()}
            onClose={() => onCancel()}
            title="Thanh toán"
            okText="Thanh toán"
            onOk={() => handleSave()}
            destroyOnClose
        >
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                    <h3 className={'font-bold text-xl'}>{t('Chi tiết thanh toán')}</h3>
                    <Form form={formProductItems}>
                        <GridProductItems form={form}/>
                    </Form>
                </div>
                <div className="w-full md:w-[400px]">
                    <Row>
                        <Col span={24}>
                            <Form
                                form={form}
                                onChange={triggerDirty}
                                onInput={triggerDirty}
                            >
                                <Form.Item hidden name='id'/>
                                <RightBox formProductItems={formProductItems}/>
                                <Form.Item hidden name={'fetchData'}/>
                                <Form.Item hidden name={'partnerName'}/>
                                <Form.Item hidden name='partnerId'/>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};

export default observer(CheckoutModalForm);
