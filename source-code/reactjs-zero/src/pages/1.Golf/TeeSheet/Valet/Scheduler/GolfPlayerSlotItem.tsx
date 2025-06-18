import React from 'react';
import {FlightSlot, GolfFlightOutputDto} from "@api/index.defs";
import {useStore} from '@ord-store/index';
import {useDndContext} from "@dnd-kit/core";
import {useTranslation} from "react-i18next";
import {
    BookingStatusEnum,
    CheckInStatusEnum,
    selectedRowName,
    TeetimeSlotEnum
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {CheckOutlined, ExclamationCircleOutlined, LockOutlined, StopOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import {
    extShowCancelCheckInModal,
    extShowCheckInModal
} from "@pages/1.Golf/TeeSheet/Booking/checkin/FunctionComfirmCheckInModal";
import {extShowCancelCheckOutModal} from "@pages/1.Golf/TeeSheet/Booking/checkout/FunctionComfirmCheckOutModal";
import {CardIcon} from "@ord-components/icon/CardIcon";

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

    const rowKey = selectedRowName(boardIdx, rowIndex);
    const isSelected = selectedCells[rowKey]?.data.listSlot?.map(x => x.playerNo).includes(slot.playerNo);


    function handleCellClick() {
        mainStore.setSelectSlotMode(true);
        mainStore.handleCellClick(boardIdx, rowIndex, flight, slot);
    }

    function handleRowClick() {
        mainStore.setSelectSlotMode(true);
        mainStore.handleSelectRow(boardIdx, rowIndex, flight);
    }

    if (slot.status === TeetimeSlotEnum.Available) {
        return (
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
                        if ($event.shiftKey) {

                        } else {
                            mainStore.openCreateModal({
                                boardId: props.boardIdx,
                                courseId: flight.courseId,
                                playerNo: slot.playerNo,
                                playDate: flight.playDate,
                                startTime: flight.startTime,
                            });
                        }

                    }}
                    // to={bookingUrl}
                    className='w-full h-full flex items-center justify-center transition '>
                    <button
                        className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-green-500 text-green-500 text-lg">
                        <span className="font-bold mb-1">+</span>
                    </button>
                </div>
            </div>
        );
    } else if (slot.status === TeetimeSlotEnum.Invisude) {
        return <div
            className={`${commonClass} cursor-no-drop slot-invisible`}>
            <div
                className='w-full h-full flex items-center justify-center transition '>
                <div className='div-in-invisible w-full h-full flex items-center justify-center transition '>
                    <ExclamationCircleOutlined/><span className='ml-1'>{t('noJoint')}</span>
                </div>
            </div>
        </div>
    } else if (slot.status === TeetimeSlotEnum.Locked) {
        return <div
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
    } else if (slot.status === TeetimeSlotEnum.Maintenance) {
        return <div
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
    const handleClick = () => {
        if (props.onSlotClick) {
            props.onSlotClick(props.boardIdx, props.rowIndex, props.colIndex);
        }
    };
    return (

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
                onClick={() => {
                    mainStore.openViewTeeTimeBottomModal(boardIdx, rowIndex, flight);
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

    );
}

export default observer(GolfPlayerSlotItem);
