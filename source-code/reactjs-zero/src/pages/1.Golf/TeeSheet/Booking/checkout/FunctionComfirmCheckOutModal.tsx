import {SaleInvoiceDto} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import React from "react";
import GolfCheckInOutStore from "@ord-store/Golf/TeeSheet/Booking/GolfCheckInOutStore";
import {l} from "@ord-core/language/lang.utils";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import PaymentCentralBillingStore from "@ord-store/Restaurant/paymentCentralBillingStore";

export function extShowCancelCheckOutModal(param: {
    store: GolfCheckInOutStore,
    bookingPlayerId: string | undefined;
    partnerName?: string;
    callBackSuccess: (res: boolean) => void;
}) {
    const {bookingPlayerId, partnerName, callBackSuccess, store} = param;

    function t(value: string, params?: any) {
        return l.trans(store.getNamespaceLocale() + "." + value, params)
    }

    if (!bookingPlayerId) return;

    const parsedId = parseInt(bookingPlayerId);

    UiUtils.showConfirm({
        title: t("comfirmCancelCheckout"),
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: t('comfirmCancelCheckoutContentModal', {value: partnerName}),
                }}
            />
        ),
        // okLabel: "Checkin",
        onOk: (d) => {
            UiUtils.setBusy()
            GolfTeeSheetService.cancelCheckout({
                bookingPlayerId: parsedId,
            })
                .then(res => {
                    if (res.data) {
                        UiUtils.showSuccess(t('cancelCheckoutSuccess'));
                        callBackSuccess(res.data);
                    } else {
                        UiUtils.showError(res.message);
                    }
                    UiUtils.clearBusy()
                }, (e) => {
                    UiUtils.clearBusy()
                    UiUtils.showCatchError(e);
                })
        },
        onCancel: () => {
        },
    });
}
interface IShowAfterCheckOutModalParam{
    checkInOutStore: GolfCheckInOutStore,
    centralBillingStore: PaymentCentralBillingStore,
    bookingId: string | undefined;
    bookingPlayerId: string | undefined;
    bookingGroupId: string | undefined;
    partnerName?: string;
    partnerId?: string,
    mainInvoiceId?: string,
    callBackTimeCheckout: (checkOutTime: Date) => void;
}
export function extShowAfterCheckOutModal(param: IShowAfterCheckOutModalParam) {

    const {
        bookingPlayerId,
        bookingId,
        partnerName,
        bookingGroupId, callBackTimeCheckout, checkInOutStore, centralBillingStore,
        mainInvoiceId, partnerId
    } = param;
    if (!bookingPlayerId || !bookingId) return;
    checkInOutStore.onAfterCheckOut({
        bookingId: bookingId,
        bookingPlayerId: bookingPlayerId,
        bookingGroupId: bookingGroupId,
        callbackCanPay: () => {
            extPaymentAndCheckOutModal(param);
        }
    })
}

export function extPaymentAndCheckOutModal(param: IShowAfterCheckOutModalParam){
    const {
        bookingPlayerId,
        bookingId,
        partnerName,
        bookingGroupId, callBackTimeCheckout, checkInOutStore, centralBillingStore,
        mainInvoiceId, partnerId
    } = param;

    centralBillingStore.openCreateModal({
        partnerId: partnerId,
        partnerName: partnerName,
        mainInvoiceId: mainInvoiceId,
        customSave: (formDto: SaleInvoiceDto, callBackSuccess) => {
            checkInOutStore.paymentAndCheckout({
                invoice: formDto,
                bookingId: bookingId,
                bookingPlayerId: bookingPlayerId,
                bookingGroupId: bookingGroupId,
                callback: (dataCheck) => {
                    if (dataCheck.checkoutTime)
                        callBackTimeCheckout(dataCheck.checkoutTime);
                    if (dataCheck.invoice)
                        callBackSuccess(dataCheck.invoice);
                }
            })
        }
    })
}
