import React, {useEffect, useState} from 'react';
import {Button, Drawer, Tabs} from "antd";
import {FlightSlot, GolfFlightOutputDto, PlayerInfoByIdOutputDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";
import {CalendarOutlined, FieldTimeOutlined} from "@ant-design/icons";
import {formatTime, TeetimeSlotEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {GolferIcon} from "@ord-components/icon/GolferIcon";
import {LockerIcon} from "@ord-components/icon/LockerIcon";
import {BuggyIcon} from "@ord-components/icon/BuggyIcon";
import './ViewDetailPlayer.scss'
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {useTranslation} from "react-i18next";
import WrapCardLocker from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/WrapCardLocker";
import BuggyBottomCard from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/BuggyBottomCard";
import WrapCardPlayerInfo from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/WrapCardPlayerInfo";
import {CartIcon} from "@ord-components/icon/CartIcon";
import {CheckInService} from "@api/CheckInService";
import UiUtils from "@ord-core/utils/ui.utils";
import {CardIcon} from "@ord-components/icon/CardIcon";
import ManagerCardPlayer from "@pages/1.Golf/TeeSheet/Booking/components/ManagerCardPlayer";
import AddProductCard from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/AddProductCard";

export interface IViewDetailPlayerProps {
    boardIdx: number,
    rowIdx: number,
    flight: GolfFlightOutputDto,
    colIdx: number,
    slot: FlightSlot,
    fullInfo: PlayerInfoByIdOutputDto
    changeFullInfoClient?: (data: PlayerInfoByIdOutputDto) => void;
    refreshFullInfo?: () => void;
}

const ViewDetailPlayer = () => {
    const {
        golfBookingStore: mainStore,
        golfSelectProductStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tAc} = useTranslation('golf_access_card');

    const {
        flight,
        slot,
        colIdx,
        rowIdx,
        boardIdx
    } = mainStore?.viewDetailPlayerModal?.entityData ?? {} as IViewDetailPlayerProps;
    const maxPlayer = flight?.maxGroupPerFlight ?? 4;
    const totalSlot = flight?.listSlot?.filter(f => f.bookingPlayerId)?.length ?? 0;
    const allowCreate = (flight?.listSlot?.findIndex(f => f.status === TeetimeSlotEnum.Available) ?? -1) > -1
    const firstBookingId = flight?.listSlot?.find(f => f.bookingId)?.bookingId;
    const height = 454;
    const [info, setInfo] = useState<PlayerInfoByIdOutputDto>({});
    const [activeKey, setActiveKey] = useState<string>();

    useEffect(() => {
        if (slot && slot.bookingPlayerId)
            fetchData();
    }, [slot]);
    const fetchData = async () => {
        try {
            const data = await CheckInService.getMemberInfoByPlayerId({
                bookingPlayerId: slot.bookingPlayerId ? Number(slot.bookingPlayerId) : 0
            });
            if (data.isSuccessful) {
                setInfo(data.data ?? {});
            } else {
                UiUtils.showError(data.message);
            }
        } catch (e) {
            UiUtils.showCatchError(e);
        }

    };

    function changeFullInfoClient(v: PlayerInfoByIdOutputDto) {
        setInfo(v);
    }
    function onDrawerClose(){
        mainStore.closeViewDetailPlayerModal();
        setActiveKey("Golfer");
        golfSelectProductStore.resetSelectProduct()
    }
    return (
        <>
            <Drawer
                styles={{
                    body: {
                        padding: 0
                    }
                }}
                destroyOnClose={true}
                width={'50%'}
                title={<div className="text-lg font-bold">
                    <CalendarOutlined></CalendarOutlined> {DateUtil.toFormat(flight?.playDate, "DD/MM/YYYY")}
                    <FieldTimeOutlined
                        className='ml-2'></FieldTimeOutlined> {formatTime(flight?.startTime)}
                </div>}
                open={mainStore.viewDetailPlayerModal.visible}
                onClose={() => onDrawerClose()}
            >
                <Tabs
                    className='custom-tabs'
                    defaultActiveKey="1"
                    activeKey={activeKey}
                    // destroyInactiveTabPane={true}
                    size='small'
                    tabPosition='left'
                    onChange={(key) => {
                        setActiveKey(key);
                    }}
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
                                minHeight: 'calc(100vh - 70px)',
                            },
                            key: "Golfer",
                            children: <>
                                {slot && <WrapCardPlayerInfo boardIdx={boardIdx} flight={flight} rowIdx={rowIdx}
                                                             colIdx={colIdx}
                                                             fullInfo={info}
                                                             onAddServiceClick={() => {
                                                                 setActiveKey("product");
                                                             }}
                                                             changeFullInfoClient={(v) => {
                                                                 changeFullInfoClient(v);
                                                             }}
                                                             refreshFullInfo={() => {
                                                                 fetchData();
                                                             }}
                                                             slot={slot}></WrapCardPlayerInfo>}
                            </>
                        },
                        {
                            label: <span title='Dịch vụ sử dụng'><CartIcon/></span>,
                            style: {
                                padding: 0,
                                minHeight: 'calc(100vh - 70px)',
                            },
                            key: "product",
                            children: <>
                                {slot && <AddProductCard
                                    info={info}
                                    onClose={() => {
                                        setActiveKey("Golfer");
                                    }}
                                ></AddProductCard>}
                            </>
                        },
                        {
                            label: <span title='Thông tin tủ đồ'><LockerIcon/></span>,
                            style: {
                                padding: 0,
                                minHeight: 'calc(100vh - 70px)',
                            },
                            key: "Locker",
                            children: <>
                                {slot && <WrapCardLocker boardIdx={boardIdx} flight={flight} rowIdx={rowIdx} slot={slot}
                                                         colIdx={colIdx}
                                                         fullInfo={info}
                                ></WrapCardLocker>}
                            </>
                        },
                        {
                            label: <span title='Thông tin xe'> <BuggyIcon/></span>,
                            style: {
                                padding: 0,
                                minHeight: 'calc(100vh - 70px)',
                            },
                            key: "Buggy",
                            children: <>
                                {slot && <BuggyBottomCard
                                    boardIdx={boardIdx}
                                    flight={flight}
                                    slot={slot}
                                    colIndex={colIdx}
                                />}
                            </>
                        },
                        {
                            label: <span title={t('managerRfid')}><CardIcon/></span>,
                            style: {
                                padding: 0,
                            },
                            key: "Card",
                            children: <>
                                {slot && slot.bookingPlayerId && <ManagerCardPlayer
                                    bookingPlayerId={slot.bookingPlayerId} boardId={boardIdx}/>}
                            </>
                        }
                    ]}
                />
            </Drawer>

        </>

    );
};

export default observer(ViewDetailPlayer);
