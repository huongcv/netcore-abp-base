import React, {useState} from 'react';
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {MemberInfoByCardBookingOutputDto, MemberInfoByCardMemberOutputDto} from "@api/index.defs";
import {Button, Card, Descriptions, Empty, Modal, Space} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import {observer} from "mobx-react-lite";
import {CardIcon} from "@ord-components/icon/CardIcon";
import DateUtil from "@ord-core/utils/date.util";
import {BookIcon} from "@ord-components/icon/BookIcon";
import {CheckInStatusEnum, formatTime} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {NotFoundIcon} from "@ord-components/icon/NotFoundIcon";
import {extShowAfterCheckOutModal} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";
import {useHotkeys} from "react-hotkeys-hook";

function QuickAccessInfoModal(props: {
    hotkeyScopes: string
}) {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');

    const [isLoading, setIsLoading] = useState<boolean>();
    const {
        canCheckIn: allowCheckIn,
        canCheckOut: allowCheckOut,
        findCardStatus,
        memberCardInfo: info
    } = golfCheckInOutStore.quickAccessModal.entityData ?? {};
    const {teeTimeMap} = mainStore
    const {memberInfo, bookingInfo} = info ?? {};
    //#region Tab Player
    const onCheckInNow = (bookingPlayerId: number) => {
        if (bookingPlayerId) {
            setIsLoading(true);
            UiUtils.setBusy();
            golfCheckInOutStore.playerCheckIn(bookingPlayerId)
                .then(res => {
                    if (res.isSuccessful) {
                        UiUtils.showSuccess(t("checkinSuccess"));
                        Object.entries(mainStore.teeTimeMap)
                            .forEach(([key, value]) => {
                                mainStore.refreshTeeTimeData(parseInt(key));
                            })
                        golfCheckInOutStore.closeQuickAccessModal();
                        UiUtils.clearBusy()
                        setIsLoading(false);
                    } else {
                        UiUtils.clearBusy()
                        setIsLoading(false);
                        UiUtils.showError(res.message);
                    }
                })
        } else {
            UiUtils.showError(t("checkInNotAllowed"));
        }
    }

    function bookingNow() {
        //UiUtils.showInfo("Update");
        const tee = getFirstTeeTimeMap();
        if(tee){
            mainStore.openCreateModal({
                courseId: tee.courseId,
                playDate: tee.playDate,
                partnerId: memberInfo?.partnerId,
                isAutoGetTeeTime: true, // // stage cho việc booking icon user ở header indexFull
                //startTime: dayjs(props.value).startOf('day').toDate(),
            })
        }
         
    }
    const getFirstTeeTimeMap = (): {courseId?: string,playDate?: Date,boardId?: number} | null => {
        for (const [_, value] of Object.entries(teeTimeMap)) {
            const firstItem = value[0];
            if (firstItem?.courseId && firstItem?.playDate) {
                return {
                    courseId: firstItem.courseId,
                    playDate: firstItem.playDate,
                    boardId: 1 // bản chất boardId chỉ key của teeTimeMap => do ta lấy phần tử đầu nên boardId = 1
                }
            }
        }
        return null;
    };

    function showCheckoutModal(_bookingInfo: MemberInfoByCardBookingOutputDto, _memberInfo?: MemberInfoByCardMemberOutputDto) {
        if (_bookingInfo)
            extShowAfterCheckOutModal({
                bookingGroupId: _bookingInfo?.bookingGroupId,
                bookingPlayerId: _bookingInfo.bookingPlayerId,
                bookingId: _bookingInfo.id,
                partnerName: _memberInfo?.partnerName,
                checkInOutStore: golfCheckInOutStore,
                centralBillingStore: paymentCentralBillingStore,
                partnerId: _bookingInfo.partnerId,
                mainInvoiceId: _bookingInfo?.tempInvoiceId,
                callBackTimeCheckout: (timeCheckOut) => {
                    mainStore.refreshTeeTimeAll();
                }
            });
    }
    function openCheckinCheckOut() {
        if (bookingInfo) {
            if (allowCheckIn) {
                onCheckInNow(parseInt(bookingInfo.bookingPlayerId ?? ""))
            } else {
                if (allowCheckOut)
                    showCheckoutModal(bookingInfo);
            }
        }
    }

    useHotkeys('F8', (event) => {
        openCheckinCheckOut();
        event.preventDefault();
    }, {scopes: [props.hotkeyScopes], enableOnFormTags: true})
    useHotkeys('F10', (event) => {
        golfCheckInOutStore.closeQuickAccessModal();
        event.preventDefault();
    }, {scopes: [props.hotkeyScopes], enableOnFormTags: true})


    return (
        <div>
            <Modal
                title={<span>{t("titleCheckinModal")}</span>}
                open={golfCheckInOutStore.quickAccessModal.visible}
                width={800}
                onCancel={() => {
                    golfCheckInOutStore.closeQuickAccessModal();
                }}
                footer={<div
                    className="flex flex-wrap items-center justify-between  max-sm:flex-col">
                    <div>
                    </div>
                    <div className="flex items-center crud-modal-footer-btn-group">
                        <Button className='me-2' onClick={() => golfCheckInOutStore.closeQuickAccessModal()}>
                            <Space.Compact><Space><CloseOutlined className="me-1"/></Space>{t('cancelModal')} (F10)
                            </Space.Compact>
                        </Button>
                        <Button loading={isLoading} type='primary'
                                disabled={(!allowCheckIn && !allowCheckOut) || !memberInfo}
                                onClick={debounce(() => {
                                    openCheckinCheckOut();
                                }, 250)}>
                            <Space.Compact> <Space><SaveOutlined
                                className="me-1"/></Space>
                                {allowCheckOut ? t('checkout') : t('checkin')} (F8)
                            </Space.Compact>
                        </Button>
                    </div>
                </div>}
            >
                {!info && findCardStatus == 0 && <Empty description={t("pleaseEnterCardIdToCheckIn")}
                                                        image={<CardIcon width={100} height={100}></CardIcon>}/>}
                {findCardStatus == 2 && <Empty description={t("notFoundCardId")}
                                               image={<NotFoundIcon width={100} height={100}></NotFoundIcon>}/>}

                {memberInfo && <div className="p-4 space-y-4">
                    <Card title="Thông tin thành viên" className="shadow-md rounded-xl">
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Tên">{memberInfo.name}</Descriptions.Item>
                            <Descriptions.Item
                                label="Giới tính">{tEnum("GENDER." + memberInfo.gender) ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Số điện thoại">{memberInfo.phone ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Mã thẻ">{memberInfo.code}</Descriptions.Item>
                            <Descriptions.Item label="UID">{memberInfo.uid}</Descriptions.Item>
                            <Descriptions.Item label="Thời gian hiệu lực">
                                <div>{memberInfo.startDate ? DateUtil.toFormat(memberInfo.startDate, "DD/MM/YYYY") : '—'} →
                                    {memberInfo.endDate ? DateUtil.toFormat(memberInfo.endDate, "DD/MM/YYYY") : '—'}
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>


                    {bookingInfo && <Card title="Thông tin booking" className="shadow-md rounded-xl">
                        <Descriptions column={2} bordered size="small">
                            <Descriptions.Item label="Ngày đặt">
                                <div>{bookingInfo.bookingDate ? DateUtil.toFormat(bookingInfo.bookingDate, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng số người chơi">{bookingInfo.totalPlayers}</Descriptions.Item>

                            <Descriptions.Item label="TeeTime">
                                <div>{formatTime(bookingInfo.teeTime)}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Sân">{bookingInfo.courseName}</Descriptions.Item>

                            <Descriptions.Item label="Chơi chung flight">
                                {bookingInfo.isSharedFlight ? 'Có' : 'Không'}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label="Loại game">{tEnum("GameTypeEnum." + bookingInfo.gameType)}</Descriptions.Item>
                            <Descriptions.Item
                                label="Người yêu cầu">{bookingInfo.requestedBy ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="SĐT liên hệ">{bookingInfo.contactNo ?? '—'}</Descriptions.Item>
                            <Descriptions.Item span={2} label="Ghi chú">{bookingInfo.note ?? '—'}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái booking">
                                {tEnum("BookingStatusEnum." + bookingInfo.status)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian xác nhận">
                                <div>{bookingInfo.comfirmedDate ? DateUtil.toFormat(bookingInfo.comfirmedDate, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái Checkin">
                                {tEnum("CheckinStatusEnum." + bookingInfo.checkInStatus)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian checkin">
                                <div>{bookingInfo.checkInTime && bookingInfo.checkInStatus == CheckInStatusEnum.Checkedin ? DateUtil.toFormat(bookingInfo.checkInTime, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái Checkout">
                                {bookingInfo.checkOutTime ? t('isCheckout') : t('isNotCheckout')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian Checkout">
                                <div>{bookingInfo.checkOutTime ? DateUtil.toFormat(bookingInfo.checkOutTime, "DD/MM/YYYY HH:mm") : '—'}</div>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>}
                    {!bookingInfo && <Empty
                        description={t("notFoundBookingInfo")}
                        image={<BookIcon width={100} height={100}></BookIcon>}>
                        <Button type="primary" onClick={bookingNow}>{t('bookingNow')}</Button>
                    </Empty>}
                </div>}
            </Modal>

        </div>
    );
}

export default observer(QuickAccessInfoModal);
