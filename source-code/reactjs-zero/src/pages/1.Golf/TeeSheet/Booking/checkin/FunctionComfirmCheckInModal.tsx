import {CheckinStatusEnum} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import React from "react";
import {CardIcon} from "@ord-components/icon/CardIcon";
import {CheckinIcon} from "@ord-components/icon/CheckinIcon";
import GolfCheckInOutStore from "@ord-store/Golf/TeeSheet/Booking/GolfCheckInOutStore";
import {l} from "@ord-core/language/lang.utils";
import {CheckInService} from "@api/CheckInService";

export function extShowCancelCheckInModal(param: {
    store: GolfCheckInOutStore,
    bookingPlayerId: string | undefined;
    partnerName?: string;
    callBackSuccess: (res: CheckinStatusEnum) => void;
}) {
    const {bookingPlayerId, partnerName, callBackSuccess, store} = param;

    function t(value: string, params?: any) {
        return l.trans(store.getNamespaceLocale() + "." + value, params)
    }

    if (!bookingPlayerId) return;

    const parsedId = parseInt(bookingPlayerId);

    UiUtils.showConfirm({
        title: t("comfirmCancelCheckin"),
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: t('comfirmCancelCheckinContent', {value: partnerName}),
                }}
            />
        ),
        onOk: () => {
            UiUtils.setBusy();
            store.cancelCheckIn(parsedId).then(res => {
                if (res.isSuccessful && res.data) {
                    UiUtils.showSuccess(t('cancelCheckinSuccess'));
                    callBackSuccess(res.data);
                } else {
                    UiUtils.showError(res.message);
                }
                UiUtils.clearBusy();
            }, (err) => {
                UiUtils.clearBusy();
                UiUtils.showCatchError(err);
            });
        },
        onCancel: () => {
        },
    });
}


export async function extShowCheckInModal(param: {
    store: GolfCheckInOutStore,
    bookingPlayerId: string | undefined;
    partnerName?: string;
    callBackSuccess: (res: CheckinStatusEnum) => void;
}) {

    const {bookingPlayerId, partnerName, callBackSuccess, store} = param;

    if (!bookingPlayerId) return;

    function t(value: string, params?: any) {
        return l.trans(store.getNamespaceLocale() + "." + value, params)
    }

    const parsedId = parseInt(bookingPlayerId);

    const checkCard = await CheckInService.checkPlayerHaveAccessCard({
        bookingPlayerId: parsedId,
    })
    const haveCard = checkCard.isSuccessful && checkCard.data;

    const callCheckIn = () => {
        UiUtils.setBusy()
        store.playerCheckIn(parsedId).then((res) => {
            if (res.isSuccessful && res.data) {
                UiUtils.showSuccess(t('checkinSuccess'));
                callBackSuccess(res.data);
            } else {
                UiUtils.showSuccess(t('checkinFail'));
            }
            UiUtils.clearBusy();
        }, (err) => {
            UiUtils.clearBusy();
            UiUtils.showCatchError(err);
        });
    }

    if (haveCard) {
        UiUtils.showConfirm({
            title: t("comfirmCheckinTitle"),
            icon: "custome",
            customIcon: <CheckinIcon width={100} height={100}/>,
            content: (
                <div
                    dangerouslySetInnerHTML={{
                        __html: t('comfirmCheckInModalContent', {value: partnerName}),
                    }}
                />
            ),
            onOk: () => {
                callCheckIn();
            },
            onCancel: () => {
            },
        });
    } else {
        UiUtils.showConfirm({
            title: t("checkDontHaveAccessCard"),
            icon: "custome",
            customIcon: <CardIcon width={100} height={100}/>,
            content: (
                <>
                    Khách hàng chưa được cấp thẻ RFID, bạn có muốn tiếp tục checkin không?
                </>
            ),
            onOk: () => {
                callCheckIn();
            },
            onCancel: () => {
            },
        });
    }
}
