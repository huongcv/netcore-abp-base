import React from 'react';
import {IViewDetailPlayerProps} from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/ViewDetailPlayer";
import UiUtils from "@ord-core/utils/ui.utils";
import {Button, Card, Descriptions, MenuProps, Tag} from "antd";
import DateUtil from "@ord-core/utils/date.util";
import {BookingStatusEnum, CheckInStatusEnum, formatTime} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {FlightSlot, PlayerInfoByIdOutputDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {PlusOutlined} from "@ant-design/icons";
import {
    extShowCancelCheckInModal,
    extShowCheckInModal
} from "@pages/1.Golf/TeeSheet/Booking/checkin/FunctionComfirmCheckInModal";
import {
    extShowAfterCheckOutModal,
    extShowCancelCheckOutModal
} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";
import CardProduct from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/CardProduct";

interface IWrapCardPlayerInfoProps extends IViewDetailPlayerProps {
    onAddServiceClick: () => void;
}

function WrapCardPlayerInfo(props: IWrapCardPlayerInfoProps) {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const {flight, rowIdx, boardIdx, slot, colIdx, fullInfo: info} = props;
    const {playerInfo: memberInfo, bookingInfo} = info;

    const openUpdateModal = () => {
        mainStore.openUpdateModal({
            bookingTeeTimeId: slot.bookingTeeTimeId,
            boardId: props.boardIdx,
            courseId: flight.courseId,
            playerNo: slot.playerNo,
            playDate: flight.playDate,
            startTime: flight.startTime,
        });
    }
    const isCardMember = !!memberInfo?.memberCard?.id;
    const isHaveAccessCard = !!memberInfo?.tempCard?.id;
    const isCheckIn = slot.checkInStatus === CheckInStatusEnum.Checkedin;
    const isNoshow = slot.checkInStatus === CheckInStatusEnum.Noshow;
    const isComfirm = slot.bookingStatus === BookingStatusEnum.Confirmed
        || slot.bookingStatus === BookingStatusEnum.Paid
        || slot.bookingStatus === BookingStatusEnum.Completed;
    const isCheckout = !!memberInfo?.checkOutTime;
    const itemsAction: MenuProps['items'] = [
        {
            key: 'titlePageUpdate',
            label: t('titlePageUpdate'),
            onClick: () => {
                openUpdateModal()
            }
        },
        {
            key: 'comfirmBooking',
            disabled: isCheckIn,
            label: isComfirm ? t('cancelComfirmBooking') : t('comfirmBooking'),
            onClick: () => {
                if (bookingInfo && bookingInfo.bookingPlayerId) {
                    comfirmBookingFun();
                }
            }
        },
        {
            key: 'checkin',
            label: isCheckIn ? t('cancelCheckin') : t('checkin'),
            disabled: isNoshow || isCheckout,
            onClick: () => {
                if (bookingInfo && bookingInfo.bookingPlayerId) {
                    showCheckInModal();
                }
            }
        },
        {
            key: 'checkout',
            label: isCheckout ? t('cancelCheckout') : t('checkout'),
            disabled: isNoshow || !isCheckIn,
            onClick: () => {
                if (bookingInfo && bookingInfo.bookingPlayerId) {
                    if (isCheckout) {
                        cancelCheckout()
                    } else {
                        showCheckoutModal();
                    }
                }
            }
        },
        {
            key: 'noShow',
            disabled: isCheckIn || isCheckout,
            label: t('noShow'),
            onClick: () => {
                if (bookingInfo && bookingInfo.bookingPlayerId) {
                    noShowFun();
                }
            }
        },
        {
            key: 'paymentFull',
            label: t('paymentFull'),
            onClick: () => {
                if (bookingInfo && bookingInfo.partnerId) {
                    showPaymentFullModal();
                }
            }
        },
        {
            key: 'delete',
            label: t('delete'),
            onClick: () => {
                mainStore.deleteBooking(props.boardIdx, parseInt(slot.bookingId ?? "0"))
            }
        },
    ];

    function slotChange(slotNew: FlightSlot) {
        mainStore.updateSlotItem(boardIdx, rowIdx, slotNew);
    }

    const noShowFun = () => {
        if (slot.bookingPlayerId)
            if (isNoshow) {
                mainStore.cancelSetNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        slotChange?.(slot);
                        UiUtils.showSuccess(t('cancelNoshowSuccess'));
                    })
            } else {
                mainStore.setNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        slotChange?.(slot);
                        UiUtils.showSuccess(t('noshowSuccess'));
                    })
            }
    }
    const comfirmBookingFun = () => {
        if (slot.bookingId)
            if (isComfirm) {
                mainStore.cancelComfirmBooking(parseInt(slot.bookingId))
                    .then(res => {
                        slot.bookingStatus = res.data;
                        if (slot.groupName) {
                            mainStore.refreshTeeTimeData(props.boardIdx)
                        } else {
                            slotChange?.(slot);
                        }
                        UiUtils.showSuccess(t('cancelConfirmBookingSuccess'));
                    })
            } else {
                mainStore.comfirmBooking(parseInt(slot.bookingId))
                    .then(res => {
                        slot.bookingStatus = res.data;
                        console.log("groupName", slot.groupName)
                        if (slot.groupName) {
                            mainStore.refreshTeeTimeData(props.boardIdx)
                        } else {
                            slotChange?.(slot);
                        }
                        UiUtils.showSuccess(t('confirmBookingSuccess'));
                    })
            }
    }

    const showCheckInModal = () => {
        if (isCheckIn) {
            extShowCancelCheckInModal({
                store: golfCheckInOutStore,
                bookingPlayerId: slot.bookingPlayerId,
                partnerName: slot.partnerName,
                callBackSuccess: (res) => {
                    slot.checkInStatus = res;
                    slot.bookingStatus = BookingStatusEnum.Confirmed;
                    if (bookingInfo)
                        bookingInfo.checkInTime = new Date();
                    slotChange?.(slot);
                }
            })

        } else {
            extShowCheckInModal({
                store: golfCheckInOutStore,
                bookingPlayerId: slot.bookingPlayerId,
                partnerName: slot.partnerName,
                callBackSuccess: (res) => {
                    slot.checkInStatus = res;
                    slot.bookingStatus = BookingStatusEnum.Confirmed;
                    if (bookingInfo)
                        bookingInfo.checkInTime = new Date();
                    slotChange?.(slot);
                    // UiUtils.showSuccess(t('checkinSuccess'));
                }
            });
        }
    }

    function changeInfoClient(info: PlayerInfoByIdOutputDto) {
        if (props.changeFullInfoClient)
            props.changeFullInfoClient?.(info);
    }

    function cancelCheckout() {
        extShowCancelCheckOutModal({
            store: golfCheckInOutStore,
            bookingPlayerId: bookingInfo?.bookingPlayerId,
            partnerName: memberInfo?.partnerName,
            callBackSuccess: (res) => {
                if (memberInfo) {

                    memberInfo.checkOutTime = undefined;
                    changeInfoClient({
                        ...info,
                        playerInfo: {
                            ...memberInfo
                        }
                    });
                    slot.checkOutTime = undefined
                    slotChange?.(slot);

                }
            }
        })
    }

    function showPaymentFullModal() {
        paymentCentralBillingStore.openCreateModal({
            partnerId: bookingInfo?.partnerId,
            partnerName: memberInfo?.partnerName,
            mainInvoiceId: bookingInfo?.tempInvoiceId
        })
    }

    function showCheckoutModal() {
        if (isCheckout) {
            UiUtils.showError("Bạn đã checkout rồi không thể checkout lại");
        } else {
            extShowAfterCheckOutModal({
                bookingGroupId: bookingInfo?.bookingGroupId,
                bookingPlayerId: slot.bookingPlayerId,
                bookingId: slot.bookingId,
                partnerName: slot.partnerName,
                checkInOutStore: golfCheckInOutStore,
                centralBillingStore: paymentCentralBillingStore,
                partnerId: slot.partnerId,
                mainInvoiceId: bookingInfo?.tempInvoiceId,
                callBackTimeCheckout: (timeCheckOut) => {
                    // fetchData();
                    props.refreshFullInfo?.();
                    slot.checkOutTime = timeCheckOut
                    slotChange?.(slot);
                }

            });
            // showPaymentFullModal();
        }
    }

    const StatusBooking = () => {
        if (isCheckout) {
            return <Tag title={t('checkOutAt', {
                time: DateUtil.toFormat(bookingInfo?.checkOutTime, "DD/MM/YYYY HH:mm")
            })} color="red">
                {t('isCheckOut')};
            </Tag>
        } else if (isCheckIn) {
            return <Tag title={t('checkedInAt', {
                time: DateUtil.toFormat(bookingInfo?.checkInTime, "DD/MM/YYYY HH:mm")
            })} color="green">
                {t('checkedIn')};
            </Tag>
        } else {
            return <Tag>{t('notCheckIn')}</Tag>;
        }

    }
    const showInfoPlayerInfo = () => {
        alert("Xem");
    }
    return (
        <>
            <Card className='mt-2' title={<strong>{t('bookingStepInfo1')}</strong>}
                  styles={
                      {
                          header: {
                              borderBottom: "none",
                              marginTop: "10px"
                          },
                      }
                  }>
                <Descriptions bordered={true} column={2} size="small">
                    {memberInfo && bookingInfo && <>
                        <Descriptions.Item label={t("partnerName")}>
                            <Button type='link' onClick={showInfoPlayerInfo}>
                                {memberInfo?.partnerName}
                            </Button>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("status")}>
                            <StatusBooking></StatusBooking>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={t('gender')}>{tEnum("GENDER." + memberInfo?.gender) ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{memberInfo.phone ?? '—'}</Descriptions.Item>
                        <Descriptions.Item  label={t('partnerGroup')}>
                            {memberInfo.partnerGroup}
                        </Descriptions.Item>
                        <Descriptions.Item  label={t('RFID')}>
                            {memberInfo.memberCard &&
                                <div>Thẻ thành viên:<strong>{memberInfo.memberCard?.code}</strong></div>}
                            {memberInfo.tempCard && <div>Thẻ RFID:<strong>{memberInfo.tempCard?.code}</strong></div>}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingCaddyCode')}>
                            <div>{memberInfo.bookingCaddyCode} - {memberInfo.bookingCaddyName} </div>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('caddyAssignedCode')}>
                            <div>{memberInfo.caddyAssignedCode} - {memberInfo.caddyAssignedName} </div>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('bookingDate')}>
                            <div>{bookingInfo.bookingDate ? DateUtil.toFormat(bookingInfo.bookingDate, "DD/MM/YYYY") : '—'}</div>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('totalPlayers')}>{bookingInfo.totalPlayers}</Descriptions.Item>

                        <Descriptions.Item label={t('teeTime')}>
                            <div>{formatTime(bookingInfo.teeTime)}</div>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('courseName')}>{bookingInfo.courseName}</Descriptions.Item>

                        <Descriptions.Item label={t('isSharedFlight')}>
                            {bookingInfo.isSharedFlight ? 'Có' : 'Không'}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={t('gameType')}>{tEnum("GameTypeEnum." + bookingInfo.gameType)}</Descriptions.Item>

                        <Descriptions.Item span={2} label={t('note')}>{bookingInfo.note ?? '—'}</Descriptions.Item>
                    </>}

                </Descriptions>
            </Card>

            <Card className='mt-2' title={<strong>{t('serviceRegisterInfo')}</strong>}
                  extra={
                      <Button onClick={() => props.onAddServiceClick()}>
                          <PlusOutlined></PlusOutlined>
                          {t('addService')}
                      </Button>
                  }
                  styles={
                      {
                          header: {
                              borderBottom: "none",
                              marginTop: "10px"
                          },
                      }
                  }>
                <CardProduct
                    slot={slot}
                ></CardProduct>
            </Card>

        </>
    );
}

export default WrapCardPlayerInfo;
