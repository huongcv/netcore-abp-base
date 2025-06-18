import React from 'react';
import {FlightSlot, GolfFlightOutputDto} from "@api/index.defs";
import {useStore} from '@ord-store/index';
import {useDndContext} from "@dnd-kit/core";
import {useTranslation} from "react-i18next";
import {Dropdown, MenuProps} from "antd";
import {SortableSlot} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/SortableSlot";
import {
    BookingStatusEnum,
    CheckInStatusEnum,
    selectedRowName, slotName,
    TeetimeSlotEnum
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {BookOutlined, CheckOutlined, ExclamationCircleOutlined, LockOutlined, StopOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {Edit2Icon} from "@ord-components/icon/Edit2Icon";
import {EditIcon} from "@ord-components/icon/EditIcon";
import UiUtils from "@ord-core/utils/ui.utils";
import {CardIcon} from "@ord-components/icon/CardIcon";
import {BookIcon} from "@ord-components/icon/BookIcon";
import {
    extShowCancelCheckInModal,
    extShowCheckInModal
} from "@pages/1.Golf/TeeSheet/Booking/checkin/FunctionComfirmCheckInModal";
import {
    extShowCancelCheckOutModal,
    extShowAfterCheckOutModal
} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";

export interface IGolfPlayerSlotItemProps {
    rowIndex: number,
    flight: GolfFlightOutputDto,
    slot: FlightSlot,
    colIndex: number,
    boardIdx: number,
    onSlotClick?: (boardIdx: number, rowIdx: number, slotIndex: number) => void;
}

function GolfPlayerSlotItem(props: IGolfPlayerSlotItemProps) {
    const {
        golfBookingStore: mainStore,
        golfCheckInOutStore,
        paymentCentralBillingStore: paymentFullStore,
    } = useStore();
    const {slot, rowIndex, flight, boardIdx, colIndex} = props;
    const {selectedCells} = mainStore;
    const {active} = useDndContext();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const commonClass = ` group flex items-center justify-center cursor-pointer transition h-full
           ml-1 relative relative`;

    const keyDragDrop = slotName(boardIdx, rowIndex, colIndex);
    const isDragging = active?.id === keyDragDrop;

    if (isDragging)
        // Placeholder giữ chỗ nếu đang kéo
        return <div
            key={slot.playerNo}
            className={`${commonClass} bg-green-100 border-green-100  `}
        >
            <span>Đang kéo...</span>
        </div>;
    const rowKey = selectedRowName(boardIdx, rowIndex);
    const isSelected = selectedCells[rowKey]?.data.listSlot?.map(x => x.playerNo).includes(slot.playerNo);

    function openGroupBooking() {
        mainStore.openGroupBookingModal({
            boardId: props.boardIdx,
            courseId: flight.courseId,
            playerNo: slot.playerNo,
            playDate: flight.playDate,
            startTime: flight.startTime,
        })
    }

    function openPrivateBooking() {
        mainStore.openCreateModal({
            boardId: props.boardIdx,
            courseId: flight.courseId,
            playerNo: slot.playerNo,
            playDate: flight.playDate,
            startTime: flight.startTime,
        });
    }

    function openEdit() {
        mainStore.openUpdateModal({
            bookingTeeTimeId: slot.bookingTeeTimeId,
            boardId: props.boardIdx,
            courseId: flight.courseId,
            playerNo: slot.playerNo,
            playDate: flight.playDate,
            startTime: flight.startTime,
        })
    }

    const noShowFun = () => {
        if (slot.bookingPlayerId)
            if (isNoshow) {
                mainStore.cancelSetNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        UiUtils.showSuccess(t('cancelNoshowSuccess'));
                        mainStore.updateSlotItem(boardIdx, rowIndex, slot);
                    })
            } else {
                mainStore.setNoShow(parseInt(slot.bookingPlayerId))
                    .then(res => {
                        slot.checkInStatus = res.data;
                        mainStore.updateSlotItem(boardIdx, rowIndex, slot);
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
                        mainStore.updateSlotItem(boardIdx, rowIndex, slot);
                        UiUtils.showSuccess(t('cancelConfirmBookingSuccess'));
                    })
            } else {
                mainStore.comfirmBooking(parseInt(slot.bookingId))
                    .then(res => {
                        slot.bookingStatus = res.data;
                        console.log("groupName", slot.groupName)
                        mainStore.updateSlotItem(boardIdx, rowIndex, slot);
                        UiUtils.showSuccess(t('confirmBookingSuccess'));
                    })
            }
    }


    function handleCellClick() {
        mainStore.setSelectSlotMode(true);
        mainStore.handleCellClick(boardIdx, rowIndex, flight, slot);
    }

    function handleRowClick() {
        mainStore.setSelectSlotMode(true);
        mainStore.handleSelectRow(boardIdx, rowIndex, flight);
    }

    if (slot.status === TeetimeSlotEnum.Available) {
        const itemsContextMenuAvailable: MenuProps['items'] = [
            {
                label: t('privateBooking'),
                key: '1',
                onClick: () => {
                    openPrivateBooking();
                }
            },
            {
                type: 'divider',
            },
            {
                label: t('selectSlot'),
                key: '2',
                onClick: () => {
                    handleCellClick()
                }
            },
            {
                label: t('selectAllTeeTime'),
                key: '3',
                onClick: () => {
                    handleRowClick()
                }
            },
        ];
        return (
            <SortableSlot key={keyDragDrop} id={keyDragDrop} allowDrag={false} data={props}>
                <Dropdown menu={{items: itemsContextMenuAvailable}} trigger={['contextMenu']}>
                    <div
                        className={`${commonClass} slot-empty`}>
                        {/*bg-[#3BB54A] text-white*/}
                        {mainStore.selectSlotMode &&
                            <div
                                className='h-full aspect-square  flex justify-center align-center border border-gray-300'
                                onClick={() => handleCellClick()}>
                                {isSelected && <CheckOutlined/>}
                            </div>}
                        <div
                            onClick={($event) => {
                                openGroupBooking()
                            }}
                            // to={bookingUrl}
                            className='w-full h-full flex items-center justify-center transition '>
                            <button
                                className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-green-500 text-green-500 text-lg">
                                <span className="font-bold mb-1">+</span>
                            </button>
                        </div>
                    </div>
                </Dropdown>
            </SortableSlot>
        );
    } else if (slot.status === TeetimeSlotEnum.Invisude) {
        return <Dropdown menu={{items: []}} trigger={['contextMenu']}>
            <div
                className={`${commonClass} cursor-no-drop slot-invisible`}>
                <div
                    className='w-full h-full flex items-center justify-center transition '>
                    <div className='div-in-invisible w-full h-full flex items-center justify-center transition '>
                        <ExclamationCircleOutlined/><span className='ml-1'>{t('noJoint')}</span>
                    </div>
                </div>

            </div>
        </Dropdown>
    } else if (slot.status === TeetimeSlotEnum.Locked) {
        const items: MenuProps['items'] = [
            {
                label: t('selectSlot'),
                key: '2',
                onClick: () => {
                    handleCellClick()
                }
            },
            {
                label: t('selectAllTeeTime'),
                key: '3',
                onClick: () => {
                    handleRowClick()
                }
            },
        ]
        return <Dropdown menu={{items: items}} trigger={['contextMenu']}>
            <div
                className={`${commonClass} slot-locked cursor-no-drop`}>
                {mainStore.selectSlotMode &&
                    <div className='h-full aspect-square flex justify-center align-center border-gray-300 border-solid'
                         style={{
                             border: "solid 1px #8c8c8c",
                         }}
                         onClick={() => handleCellClick()}>
                        {isSelected && <CheckOutlined/>}
                    </div>}
                <div
                    className='w-full h-full flex items-center justify-center transition '>
                    <div
                        className='w-full h-full flex items-center justify-center transition '>
                        <LockOutlined/> <span className='ml-1'>{t('isLock')}</span>
                        {/*<LockOutlined></LockOutlined>*/}
                    </div>
                </div>
            </div>
        </Dropdown>
    } else if (slot.status === TeetimeSlotEnum.Maintenance) {
        const items: MenuProps['items'] = [
            {
                label: t('selectSlot'),
                key: '2',
                onClick: () => {
                    handleCellClick()
                }
            },
            {
                label: t('selectAllTeeTime'),
                key: '3',
                onClick: () => {
                    handleRowClick()
                }
            },
        ]
        return <Dropdown menu={{items: items}} trigger={['contextMenu']}>
            <div
                className={`${commonClass} slot-maintenance cursor-no-drop`}>
                {mainStore.selectSlotMode &&
                    <div className='h-full aspect-square flex justify-center align-center border-gray-300 border-solid'
                         style={{
                             border: "solid 1px",
                         }}
                         onClick={() => handleCellClick()}>
                        {isSelected && <CheckOutlined/>}
                    </div>}
                <div
                    className='w-full h-full flex items-center justify-center transition '>
                    <div
                        className='w-full h-full flex items-center justify-center transition '>
                        <StopOutlined/> <span className='ml-1'>{t('isMaintenance')}</span>
                        {/*<LockOutlined></LockOutlined>*/}
                    </div>
                </div>

            </div>
        </Dropdown>
    }
    const isCheckIn = slot.checkInStatus === CheckInStatusEnum.Checkedin;
    const isNoshow = slot.checkInStatus === CheckInStatusEnum.Noshow;
    const isComfirm = slot.bookingStatus === BookingStatusEnum.Confirmed
        || slot.bookingStatus === BookingStatusEnum.Paid
        || slot.bookingStatus === BookingStatusEnum.Completed;
    const isCheckout = !!slot.checkOutTime;

    const classColor = () => {
        if (isCheckout) {
            return 'slot-checkout';
        } else if (isCheckIn) {
            return 'slot-checkin';
        } else if (isComfirm) {
            return 'slot-confirmed';
        } else {
            return "slot-pending"
        }
    }
    const showCheckInModal = async () => {
        if (isCheckIn) {
            extShowCancelCheckInModal({
                store: golfCheckInOutStore,
                bookingPlayerId: slot.bookingPlayerId,
                partnerName: slot.partnerName,
                callBackSuccess: (res) => {
                    slot.checkInStatus = res;
                    slot.bookingStatus = BookingStatusEnum.Confirmed;
                    mainStore.updateSlotItem(boardIdx, rowIndex, slot);
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
                    mainStore.updateSlotItem(boardIdx, rowIndex, slot);
                    // UiUtils.showSuccess(t('checkinSuccess'));
                }
            });
        }
    }

    function cancelCheckout() {
        extShowCancelCheckOutModal({
            store: golfCheckInOutStore,
            bookingPlayerId: slot.bookingPlayerId,
            partnerName: slot.partnerName,
            callBackSuccess: (res) => {
                slot.checkOutTime = undefined;
                mainStore.updateSlotItem(boardIdx, rowIndex, slot);
            }
        })
    }


    const itemsContextMenu: MenuProps['items'] = [
        // {
        //     key: 'checkin',
        //     // icon: <BookOutlined/>,
        //     label: isCheckIn ? t('cancelCheckin') : t('checkin'),
        //     disabled: isCheckout,
        //     onClick: () => {
        //         if (slot.bookingPlayerId) {
        //             showCheckInModal();
        //         }
        //     }
        // },
        // {
        //     key: 'checkout',
        //     // icon: <BookOutlined/>,
        //     disabled: !isCheckIn,
        //     label: isCheckout ? t('cancelCheckout') : t('checkout'),
        //     onClick: () => {
        //         if (slot.bookingPlayerId) {
        //             if (isCheckout) {
        //                 cancelCheckout()
        //             } else {
        //                 showCheckoutModal();
        //             }
        //         }
        //     }
        // },
        {
            key: 'comfirmBooking',
            // icon: <BookOutlined/>,
            disabled: isCheckIn,
            label: isComfirm ? t('cancelComfirmBooking') : t('comfirmBooking'),
            onClick: () => {
                if (slot.bookingPlayerId) {
                    comfirmBookingFun();
                }
            }
        },
        // {
        //     label: t('actionBtn.edit'),
        //     key: '1',
        //     // icon: <EditIcon/>,
        //     onClick: () => {
        //         openEdit();
        //     }
        // },

        // {
        //     key: 'noShow',
        //     disabled: isCheckIn,
        //     label: t('noShow'),
        //     onClick: () => {
        //         if (slot.bookingPlayerId) {
        //             noShowFun();
        //         }
        //     }
        // },
        {
            type: 'divider',
        },
        {
            label: t('selectSlot'),
            key: '2',
            icon: <CheckOutlined/>,
            onClick: () => {
                handleCellClick()
            }
        },
        {
            label: t('selectAllTeeTime'),
            icon: <CheckOutlined/>,
            key: '3',
            onClick: () => {
                handleRowClick()
            }
        },
    ]

    const handleClick = () => {
        if (props.onSlotClick) {
            props.onSlotClick(props.boardIdx, props.rowIndex, props.colIndex);
        }
    };
    return (

        <SortableSlot key={keyDragDrop} id={keyDragDrop} data={props}>
            <Dropdown menu={{items: itemsContextMenu}} trigger={['contextMenu']}>
                <div
                    key={slot.playerNo}
                    className={`${commonClass} wrapper ${classColor()}`}
                    onClick={handleClick}
                >
                    {mainStore.selectSlotMode &&
                        <div
                            className='h-full aspect-square flex justify-center align-center border-gray-300 border-solid'
                            style={{
                                border: "solid 1px",
                            }}
                            onClick={() => handleCellClick()}>
                            {isSelected && <CheckOutlined/>}
                        </div>}
                    <div
                        id={keyDragDrop}
                        onClick={() => {
                            mainStore.openViewDetailPlayerModal({
                                slot: slot,
                                flight: flight,
                                rowIdx: rowIndex,
                                boardIdx: boardIdx,
                                colIdx: colIndex
                            })
                            // mainStore.openViewTeeTimeBottomModal(boardIdx, rowIndex, flight);
                        }}
                        className='w-full h-full flex items-center justify-start transition
                        text-left p-1
                        max-w-full truncate whitespace-nowrap overflow-hidden text-ellipsis
                        '>
                        <div>
                            {slot.accessCardId && <CardIcon className='mr-1' width={20} height={20}></CardIcon>}
                            {slot.groupName ? <>
                                {slot.groupName}
                                {slot.partnerName && <span className='pl-2.5 text-sm'>
                                    ({slot.partnerName})
                                </span>}
                            </> : <span>{slot.partnerName}</span>}
                        </div>


                        {isNoshow ?
                            <span className='ml-2 text-red'><StopOutlined></StopOutlined> {t('noShow')}</span> : ''}
                    </div>

                </div>
            </Dropdown>

        </SortableSlot>

    );
}

export default observer(GolfPlayerSlotItem);
