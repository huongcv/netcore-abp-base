import React, {useEffect, useRef, useState} from 'react';
import {
    CheckCircleOutlined,
    CodeOutlined,
    DollarCircleOutlined,
    EllipsisOutlined, GifOutlined, GiftOutlined,
    UserOutlined
} from "@ant-design/icons";
import {Avatar, Button, Card, Flex, MenuProps, Tag, Tooltip} from "antd";
import {FlightSlot, GolfFlightOutputDto, InfoPrivateBookingDto, SaleInvoiceDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {Trans, useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {BookingStatusEnum, CheckInStatusEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import Utils from "@ord-core/utils/utils";
import {Dropdown} from 'antd/lib';
import {CardIcon} from "@ord-components/icon/CardIcon";
import {CheckinIcon} from "@ord-components/icon/CheckinIcon";
import {CheckoutIcon} from "@ord-components/icon/CheckoutIcon";
import DateUtil from "@ord-core/utils/date.util";
import Phone2Icon from "@ord-components/icon/Phone2Icon";
import {observer} from "mobx-react-lite";
import {PAYMENT_STATUS} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import {NewIcon} from "@ord-components/icon/NewIcon";
import {CartIcon} from "@ord-components/icon/CartIcon";
import {GolfTeeSheetService} from "@api/GolfTeeSheetService";
import {
    extShowCancelCheckInModal,
    extShowCheckInModal
} from "@pages/1.Golf/TeeSheet/Booking/checkin/FunctionComfirmCheckInModal";
import {
    extShowCancelCheckOutModal,
    extShowAfterCheckOutModal
} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";
import {PaymentIcon} from "@ord-components/icon/PaymentIcon";

const CardMemberBottom = (props: {
    boardIdx: number,
    flight: GolfFlightOutputDto,
    slot: FlightSlot,
    height: number,
    slotChange?: (slot: FlightSlot) => void,
    onAddProduct: () => void,
    isAddProduct: boolean,
}) => {
    const {flight = {}, slot = {}} = props;

    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const [isLoading, setIsLoading] = useState(true);
    // const [isSelected, setIsSelected] = useState(false);
    const [infoBooking, setInfoBooking] = useState<InfoPrivateBookingDto>();
    useEffect(() => {
        if (slot.bookingPlayerId && slot.bookingId) {
            mainStore.setIsSelectProduct(slot.bookingPlayerId, slot.bookingId, infoBooking?.tempInvoiceId, false);
        }
        refreshData();

    }, [slot]);

    function refreshData() {
        if (slot.bookingTeeTimeId) {
            setIsLoading(true);
            mainStore.getInfoPrivateBooking(parseInt(slot.bookingTeeTimeId))
                .then(res => {
                    setInfoBooking(res.data)
                    setIsLoading(false);
                }, () => {
                    // setIsLoading(false);
                    setInfoBooking(undefined);
                })
        }

    }

    useEffect(() => {
        if (mainStore.productAddTempData?.[slot.bookingPlayerId ?? 0]?.refreshDataCount && slot.bookingTeeTimeId) {
            refreshData();
        }
    }, [mainStore.productAddTempData?.[slot.bookingPlayerId ?? 0]?.refreshDataCount, slot.bookingTeeTimeId]);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const playerId = slot.bookingPlayerId;

        if (!playerId) return;

        const list = mainStore.productAddTempData?.[playerId]?.listProduct;
        if (list && list.length > 0) {
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({behavior: 'smooth'});
            }, 100);
        }
    }, [slot.bookingPlayerId, mainStore.productAddTempData?.[slot.bookingPlayerId ?? 0]?.listProduct?.length]);
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
    const isGuest = !!infoBooking?.isGuest;
    const isCardMember = !!infoBooking?.memberAccessCardId;
    const isHaveAccessCard = !!infoBooking?.accessCardId;
    const isCheckIn = slot.checkInStatus === CheckInStatusEnum.Checkedin;
    const isNoshow = slot.checkInStatus === CheckInStatusEnum.Noshow;
    const isComfirm = slot.bookingStatus === BookingStatusEnum.Confirmed
        || slot.bookingStatus === BookingStatusEnum.Paid
        || slot.bookingStatus === BookingStatusEnum.Completed;
    const isCheckout = !!infoBooking?.checkoutTime;
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
                if (infoBooking && infoBooking.bookingPlayerId) {
                    comfirmBookingFun();
                }
            }
        },
        {
            key: 'checkin',
            label: isCheckIn ? t('cancelCheckin') : t('checkin'),
            disabled: isNoshow || isCheckout,
            onClick: () => {
                if (infoBooking && infoBooking.bookingPlayerId) {
                    showCheckInModal();
                }
            }
        },
        {
            key: 'checkout',
            label: isCheckout ? t('cancelCheckout') : t('checkout'),
            disabled: isNoshow || !isCheckIn,
            onClick: () => {
                if (infoBooking && infoBooking.bookingPlayerId) {
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
                if (infoBooking && infoBooking.bookingPlayerId) {
                    noShowFun();
                }
            }
        },
        {
            key: 'paymentFull',
            label: t('paymentFull'),
            onClick: () => {
                if (infoBooking && infoBooking.partnerId) {
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
    const noShowFun = () => {
        if (slot.bookingPlayerId)
            if (isNoshow) {
                mainStore.cancelSetNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        props.slotChange?.(slot);
                        UiUtils.showSuccess(t('cancelNoshowSuccess'));
                    })
            } else {
                mainStore.setNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        props.slotChange?.(slot);
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
                            props.slotChange?.(slot);
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
                            props.slotChange?.(slot);
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
                    if (infoBooking)
                        infoBooking.checkInTime = new Date();
                    props.slotChange?.(slot);
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
                    if (infoBooking)
                        infoBooking.checkInTime = new Date();
                    props.slotChange?.(slot);
                    // UiUtils.showSuccess(t('checkinSuccess'));
                }
            });
        }
    }


    function cancelCheckout() {
        extShowCancelCheckOutModal({
            store: golfCheckInOutStore,
            bookingPlayerId: infoBooking?.bookingPlayerId,
            partnerName: infoBooking?.partnerName,
            callBackSuccess: (res) => {
                if (infoBooking) {

                    infoBooking.checkoutTime = undefined;
                    setInfoBooking({
                        ...infoBooking
                    })
                    slot.checkOutTime = undefined
                    props.slotChange?.(slot);

                }
            }
        })
    }

    function showPaymentFullModal() {
        paymentCentralBillingStore.openCreateModal({
            partnerId: infoBooking?.partnerId,
            partnerName: infoBooking?.partnerName,
            mainInvoiceId: infoBooking?.tempInvoiceId
        })
    }

    function showCheckoutModal() {
        if (isCheckout) {
            UiUtils.showError("Bạn đã checkout rồi không thể checkout lại");
        } else {
            extShowAfterCheckOutModal({
                bookingGroupId: infoBooking?.bookingGroupId,
                bookingPlayerId: slot.bookingPlayerId,
                bookingId: slot.bookingId,
                partnerName: slot.partnerName,
                checkInOutStore: golfCheckInOutStore,
                centralBillingStore: paymentCentralBillingStore,
                partnerId: slot.partnerId,
                mainInvoiceId: infoBooking?.tempInvoiceId,
                callBackTimeCheckout: (timeCheckOut) => {
                    refreshData();
                    slot.checkOutTime = timeCheckOut
                    props.slotChange?.(slot);
                }

            });
            // showPaymentFullModal();
        }
    }

    const RowTotal = observer(() => {
        const count = mainStore.productAddTempData?.[slot.bookingPlayerId ?? 0]?.totalAmount ?? 0;
        return <div className="border-t pt-2 flex justify-between items-center
                text-base bg-white absolute bottom-[51px] left-0 pl-2.5 pr-2.5 w-full">
            <span className='font-bold'>{t('SubTotalDue')}</span>
            <span className="flex-grow mx-2 border-b border-dotted border-gray-400"></span>
            <span className='font-bold'>{Utils.formatterNumber((infoBooking?.debtAmount ?? 0) + count)}</span>
        </div>
    })
    const ListActionBottomCard = (): { node: React.ReactNode, isShow: boolean }[] => {
        const listAction: { node: React.ReactNode, isShow: boolean }[] = [
            {
                node: <Tooltip key="edit" title={t('addProduct')}>
                    <Button type='link' size='small'
                            onClick={() => {
                                if (slot.bookingPlayerId && slot.bookingId) {
                                    mainStore.setIsSelectProduct(slot.bookingPlayerId, slot.bookingId, infoBooking?.tempInvoiceId, true);
                                    props.onAddProduct()
                                }
                            }}>
                        <CartIcon/>
                    </Button>
                </Tooltip>,
                isShow: true
            },
            {
                node: <Tooltip key="issRfIdCardFun" title={t('managerRfid')}>
                    <Button type='link' size='small'
                            onClick={() => {
                                if (infoBooking && infoBooking.bookingPlayerId) {
                                    mainStore.openManagerCardPlayerModalModal(props.boardIdx, infoBooking.bookingPlayerId);
                                } else {
                                    UiUtils.showError(t('noData'));
                                }
                                // issRfIdCardFun();
                            }}
                    >
                        <CardIcon></CardIcon>
                    </Button>
                </Tooltip>,
                isShow: true
            },
            {
                node: <Tooltip key="checkInFun" title={t('checkin')}>
                    <Button disabled={isCheckIn} type='link' size='small'
                            onClick={() => {
                                showCheckInModal()
                            }}>
                        <CheckinIcon/>
                    </Button>
                </Tooltip>,
                isShow: !isCheckIn
            },
            {
                node: <Tooltip key="checkout" title={t('checkout')}>
                    <Button type='link' size='small'
                            onClick={() => {
                                showCheckoutModal()
                            }}>
                        <CheckoutIcon/>
                    </Button>
                </Tooltip>,
                isShow: isCheckIn && !isCheckout
            },
            {
                node: <Tooltip key="paymentFull" title={t('paymentFull')}>
                    <Button type='link' size='small'
                            onClick={() => {
                                showPaymentFullModal()
                            }}>
                        <PaymentIcon/>
                    </Button>
                </Tooltip>,
                isShow: isCheckout
            },
            {
                node: <Dropdown menu={{items: itemsAction}} trigger={['click']}>
                    <EllipsisOutlined key="ellipsis"/>
                </Dropdown>,
                isShow: true
            },
        ];
        return listAction
    }
    return (
        <Card
            className='relative'
            size={"small"}
            loading={isLoading}
            style={{
                borderRadius: 0,
                height: props.height, display: 'flex', flexDirection: 'column'
            }}
            styles={{
                body: {
                    flex: 1, overflowY: 'auto'
                }
            }}
            title={<>
                <Avatar className='mr-1.5' icon={<UserOutlined></UserOutlined>}/>
                {slot.groupName ?
                    <span>{slot.groupName} <span
                        className='text-sm'>({infoBooking?.isGuest ? infoBooking.guestName : infoBooking?.partnerName})</span>
                    </span>
                    : <span>{slot.partnerName}</span>
                }
            </>}
            extra={<>
                {isGuest ? <Tag>{t('isGuest')}</Tag> : <Tag className='ml-1' color="green">{t('member')}</Tag>}
            </>}

            actions={
                props.isAddProduct && slot.bookingPlayerId ? [
                        mainStore.productAddTempData[slot.bookingPlayerId]?.isSelected ?
                            <Button className='w-full' type='primary' onClick={() => {
                                if (slot.bookingPlayerId && slot.bookingId)
                                    mainStore.setIsSelectProduct(slot.bookingPlayerId, slot.bookingId, infoBooking?.tempInvoiceId, false);
                            }}>
                                <CheckCircleOutlined/> {t('selected')}
                            </Button> : <Button className='w-full' type='dashed' onClick={() => {
                                if (slot.bookingPlayerId && slot.bookingId)
                                    mainStore.setIsSelectProduct(slot.bookingPlayerId, slot.bookingId, infoBooking?.tempInvoiceId, true);
                            }}>
                                {t('selected')}
                            </Button>
                    ]
                    : ListActionBottomCard().filter(f => f.isShow).map(f => f.node)
            }
        >
            <div className="space-y-2">
                {/*<p><strong className='uppercase'>{slot.groupName ?? slot.partnerName}</strong></p>*/}
                <p className="text-sm text-gray-600">
                    <Tooltip title={t('phoneNumber')}>
                        <Phone2Icon></Phone2Icon>
                    </Tooltip> {infoBooking?.phone ?? t("noPhone")} </p>
                <p className="text-sm text-gray-600 flex align-center item-center" style={{alignItems: 'center'}}>
                    <Tooltip title={t('gameType')}>
                        <CodeOutlined/>
                    </Tooltip> <span className='pl-1'>{tEnum("GameTypeEnum." + infoBooking?.gameType)}</span></p>
                <Flex gap="4px 0" wrap>
                    {isComfirm && !isCheckIn && <Tag color="green">{t('isComfirmBooking')}</Tag>}
                    {!isComfirm && <Tag>{t('isNotComfirmBooking')}</Tag>}
                    {isNoshow && <Tag color="red">{t('noShow')}</Tag>}
                    {isCardMember && <Tag className='ml-1' color="blue">
                        {t('isCardMember')}
                        {/*{t(DateUtil.fromNow(infoBooking?.memberAccessCardStartDate))}*/}
                    </Tag>}
                    {isHaveAccessCard && <Tag color="orange">{t('gustHaveRFID')}</Tag>}
                    {isCheckIn && <Tag
                        color="green">{t('checkedInAt', {
                        time: DateUtil.toFormat(infoBooking?.checkInTime, "DD/MM/YYYY HH:mm")
                    })}</Tag>}
                    {isCheckout && <Tag color="red">{t('checkOutAt', {
                        time: DateUtil.toFormat(infoBooking?.checkoutTime, "DD/MM/YYYY HH:mm")
                    })}</Tag>}


                </Flex>

                <div className="border-t pt-2">
                    <span className='font-bold'>{t('serviceRegisterInfo')}</span>
                    <ul className="space-y-2">
                        {infoBooking?.viewInvoice?.map((product, index) => (
                            <li key={index} className="flex justify-between items-center text-base">
                                <div className="max-w-[15rem] flex justify-between gap-2">
                                    <div className="truncate min-w-0">{product.productName}</div>
                                    <span className="flex-shrink-0 whitespace-nowrap">x {product.qty}</span>
                                </div>
                                <div className="flex-grow mx-2 border-b border-dotted border-gray-400"></div>
                                <div className="whitespace-nowrap flex items-center">
                                    {Utils.formatterNumber(product?.totalAmount ?? 0)}
                                    {product.paymentStatus == PAYMENT_STATUS.DA_THANH_TOAN ?
                                        <Tooltip title={t('isPaid')}>
                                            <DollarCircleOutlined className='pl-1'
                                                                  style={{color: 'green'}}/>
                                        </Tooltip>

                                        : <Tooltip title={t('noPaid')}>
                                            <span
                                                className="ml-1 inline-block w-4 h-4 border border-blue-900 rounded-full"></span>
                                        </Tooltip>
                                    }
                                </div>
                            </li>
                        ))}
                        {slot.bookingPlayerId && mainStore.productAddTempData[slot.bookingPlayerId]?.listProduct?.map((product, index) =>
                            <li key={"new_" + index} className="flex justify-between items-center text-base">
                                <div
                                    className="max-w-[15rem] truncate">{product.productName} x {product.qty}</div>
                                <div className="flex-grow mx-2 border-b border-dotted border-gray-400"></div>
                                <div className="whitespace-nowrap flex items-center">
                                    {Utils.formatterNumber(product?.productPrice ?? 0)}
                                    <Tooltip title={t('isNewProduct')}>
                                        <NewIcon height={16} width={16} className='pl-1'></NewIcon>
                                    </Tooltip>
                                </div>
                            </li>
                        )}


                    </ul>
                    {infoBooking?.groupDiscountPercent &&
                        <div className="border-t  pt-2 flex justify-between items-centertext-base w-full ">
                            <span>
                                <GiftOutlined className='mr-1'></GiftOutlined>
                                {t('GroupDiscountPercent')}
                            </span>
                            <span className="flex-grow mx-2 border-b border-dotted border-gray-400"></span>
                            <span>{Utils.formatterNumber((infoBooking.groupDiscountPercent))} %</span>
                        </div>}

                    <div className='h-6' ref={bottomRef}></div>
                </div>
            </div>
            <RowTotal></RowTotal>
        </Card>

    );
};

export default observer(CardMemberBottom);
