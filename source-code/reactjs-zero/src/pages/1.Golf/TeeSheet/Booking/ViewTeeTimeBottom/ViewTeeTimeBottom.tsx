import React, {useEffect} from 'react';
import {Button, Tabs} from "antd";
import {GolfFlightOutputDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";
import {CalendarOutlined, CloseOutlined, FieldTimeOutlined} from "@ant-design/icons";
import {formatTime, TeetimeSlotEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {GolferIcon} from "@ord-components/icon/GolferIcon";
import {LockerIcon} from "@ord-components/icon/LockerIcon";
import {BuggyIcon} from "@ord-components/icon/BuggyIcon";
import {CardTrustIcon} from "@ord-components/icon/CardTrustIcon";
import './ViewTeeTimeBottom.scss'
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import ListCardMemberBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ListCardMemberBottom";
import ListCardLockerBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ListCardLockerBottom";
import ListCardBuggyBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ListCardBuggyBottom";
import {CartIcon} from "@ord-components/icon/CartIcon";
import {useTranslation} from "react-i18next";

export interface IViewTeeTimeBottomProps {
    boardIdx: number,
    rowIdx: number,

    flight: GolfFlightOutputDto,
}

const ViewTeeTimeBottom = (props: {
    height: number,
}) => {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {flight, rowIdx, boardIdx} = mainStore?.viewTeeTimeBottomModal?.entityData ?? {} as IViewTeeTimeBottomProps;
    const maxPlayer = flight?.maxGroupPerFlight ?? 4;
    const totalSlot = flight?.listSlot?.filter(f => f.bookingPlayerId)?.length ?? 0;
    const allowCreate = (flight?.listSlot?.findIndex(f => f.status === TeetimeSlotEnum.Available) ?? -1) > -1
    const firstBookingId = flight?.listSlot?.find(f => f.bookingId)?.bookingId;
    const {height} = props;
    const headerHeight = 40;
    const contentHeight = height - headerHeight;

    return (
        <>
            <div
                // style={{
                //     height: height,
                // }}
                className={`bg-white shadow-2xl rounded-t-md transition-all duration-900 ease-in-out `}>
                <div style={{
                    height: headerHeight
                }} className="flex bg-[#EEEEEE] border-b border-gray-300  px-4 rounded-t-md">
                    <div className="flex-auto flex items-center">
                        <div className="text-lg font-bold">
                            <CalendarOutlined></CalendarOutlined> {DateUtil.toFormat(flight?.playDate, "DD/MM/YYYY")}
                            <FieldTimeOutlined
                                className='ml-2'></FieldTimeOutlined> {formatTime(flight?.startTime)}
                        </div>
                    </div>
                    <div className="w-52 text-right">
                        <Button size='middle' onClick={() => mainStore.closeViewTeeTimeBottomModal()}>
                            <CloseOutlined/>
                        </Button>
                    </div>
                </div>
                <Tabs
                    className='custom-tabs'
                    defaultActiveKey="1"
                    size='small'
                    tabPosition='left'
                    // style={{height: contentHeight}}
                    tabBarExtraContent={
                        <>
                            <Button onClick={() => {
                                if (firstBookingId)
                                    mainStore.deleteBooking(boardIdx, parseInt(firstBookingId))
                            }}>
                                <Delete2Icon/>
                            </Button>
                        </>
                    }
                    items={[
                        {
                            label: <span title='Thông tin chung'><GolferIcon/></span>,
                            style: {
                                padding: 0,
                            },
                            key: "Golfer",
                            children: <ListCardMemberBottom boardIdx={boardIdx} flight={flight} rowIdx={rowIdx}
                                                            height={height}></ListCardMemberBottom>
                        },
                        // {
                        //     label: <span title={t('addProduct')}><CartIcon/></span>,
                        //     style: {
                        //         padding: 0,
                        //     },
                        //     key: "addProduct",
                        //     children: <ListCardMemberBottom boardIdx={boardIdx} flight={flight} rowIdx={rowIdx}
                        //                                     height={height}></ListCardMemberBottom>
                        // },
                        {
                            label: <span title='Thông tin tủ đồ'><LockerIcon/></span>,
                            style: {
                                padding: 0,
                            },
                            key: "Locker",
                            children: <ListCardLockerBottom boardIdx={boardIdx} flight={flight} rowIdx={rowIdx}
                                                            height={height}></ListCardLockerBottom>
                        },
                        {
                            label: <span title='Thông tin xe'> <BuggyIcon/></span>,
                            style: {
                                padding: 0,
                            },
                            key: "Buggy",
                            children: <ListCardBuggyBottom boardIdx={boardIdx} flight={flight} rowIdx={rowIdx}
                                                           height={height}></ListCardBuggyBottom>
                        },
                        {
                            label: <span title='Thông tin thanh toán'><CardTrustIcon/></span>,
                            style: {
                                padding: 0,
                            },
                            key: "Card",
                            children: <>Payment</>
                        }
                    ]}
                />
            </div>
        </>

    );
};

export default observer(ViewTeeTimeBottom);
