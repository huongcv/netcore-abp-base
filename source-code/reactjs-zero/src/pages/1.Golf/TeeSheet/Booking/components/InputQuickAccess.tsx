import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import UiUtils from "@ord-core/utils/ui.utils";
import {CheckInService} from "@api/CheckInService";
import {
    AccessCardStatusEnum,
    BookingStatusEnum,
    CheckInStatusEnum
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {Input} from "antd";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {debounce} from "lodash";
import {QrSimpleIcon} from "@ord-components/icon/QrSimplecon";
import {SearchOutlined} from "@ant-design/icons";

InputQuickAccess.propTypes = {};

function InputQuickAccess(props: {}) {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');

    const [isLoading, setIsLoading] = useState<boolean>();
    const [value, setValue] = useState<string>('');
    const onStartCheckCard = async (valueCheck: string) => {
        try {

            UiUtils.setBusy();
            setIsLoading(true);
            const res = await CheckInService.getMemberInfoByCard({
                body: {
                    cardCode: valueCheck,
                    checkInTime: new Date(),
                }
            });

            if (res.isSuccessful && res.data) {
                // UiUtils.showSuccess(t("checkSuccess"));

                const bookingInfo = res.data.bookingInfo;
                const memberInfo = res.data.memberInfo;
                setValue('');

                if (!bookingInfo || !memberInfo) {
                    UiUtils.showError(t("notFoundBookingInfo"));
                    golfCheckInOutStore.openQuickAccessModal({
                        canCheckIn: false,
                        canCheckOut: false,
                        findCardStatus: 1,
                        memberCardInfo: res.data,
                    })
                    return;
                }

                const canCheckIn = bookingInfo.status !== BookingStatusEnum.Cancelled
                    && memberInfo.accessStatus === AccessCardStatusEnum.Assigned
                    && bookingInfo.checkInStatus === CheckInStatusEnum.Notcheckedin;

                const canCheckOut = bookingInfo.status !== BookingStatusEnum.Cancelled
                    && memberInfo.accessStatus === AccessCardStatusEnum.Assigned
                    && bookingInfo.checkInStatus === CheckInStatusEnum.Checkedin;


                golfCheckInOutStore.openQuickAccessModal({
                    canCheckIn: canCheckIn,
                    canCheckOut: canCheckOut,
                    findCardStatus: 1,
                    memberCardInfo: res.data,
                })

                // console.log("dataCheck", data)
                // if (data.checkInNow) {
                //     if (canCheckIn) {
                //         onCheckInNow(parseInt(bookingInfo.bookingPlayerId ?? ""));
                //     } else if (canCheckOut) {
                //         showCheckoutModal(bookingInfo);
                //     } else {
                //         UiUtils.showError(t("checkInNotAllowed"));
                //     }
                // }
            } else {
                // setInfo(null);
                // setFindCardStatus(2);
                UiUtils.showError(res.message);
            }

        } catch (error) {
            UiUtils.showCommonValidateForm();
        } finally {
            setIsLoading(false);
            UiUtils.clearBusy();
        }
    };
    const debouncedFetch = useMemo(() => debounce(onStartCheckCard, 300), []);
    useEffect(() => {
        return () => {
            debouncedFetch.cancel();
        };
    }, [debouncedFetch]);
    return (
        <Input value={value}
               style={{height: 37, minWidth:320}}
               onBlur={() => {
                   setValue('')
               }}
               prefix={<SearchOutlined></SearchOutlined>}
               suffix={<QrSimpleIcon></QrSimpleIcon>}
                placeholder={t("quickAccessPlaceHolder")}
               onChange={(val) => {
            setValue(val.target.value)
            if (val.target.value.length < 4) return;
                debouncedFetch(val.target.value);
        }}></Input>
    );
}

export default InputQuickAccess;
