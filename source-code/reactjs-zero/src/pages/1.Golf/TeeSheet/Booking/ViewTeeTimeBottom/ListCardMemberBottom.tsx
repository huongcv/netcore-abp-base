import React, {useEffect} from 'react';
import {Button, Col, Row, Splitter, Tabs} from "antd";
import {GolfFlightOutputDto, GolfProductSimpleDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import CardMemberBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/CardMemberBottom";
import {observer} from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";
import {CalendarOutlined, CloseOutlined, FieldTimeOutlined, PlusCircleFilled} from "@ant-design/icons";
import {formatTime, TeetimeSlotEnum} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {GolferIcon} from "@ord-components/icon/GolferIcon";
import {LockerIcon} from "@ord-components/icon/LockerIcon";
import {BuggyIcon} from "@ord-components/icon/BuggyIcon";
import {CardTrustIcon} from "@ord-components/icon/CardTrustIcon";
import './ViewTeeTimeBottom.scss'
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";
import {IViewTeeTimeBottomProps} from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ViewTeeTimeBottom";
import AddProductCard, {IAddProductTemp} from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/AddProductCard";


interface IListCardMemberBottom extends IViewTeeTimeBottomProps {
    height: number
}

const ListCardMemberBottom = (props: IListCardMemberBottom) => {
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const {flight, rowIdx, boardIdx, height} = props;
    const maxPlayer = flight?.maxGroupPerFlight ?? 4;
    const totalSlot = flight?.listSlot?.filter(f => f.bookingPlayerId)?.length ?? 0;
    const [isAddProduct, setIsAddProduct] = React.useState(false);
    const maxCol = maxPlayer > 5 ? 5 : maxPlayer;
    const maxColLg = maxPlayer > 3 ? 3 : maxPlayer;
    const slotAvailableIdx = flight?.listSlot?.find(f => f.status === TeetimeSlotEnum.Available)?.playerNo;
    const headerHeight = 40;
    const contentHeight = height - headerHeight;
    useEffect(() => {
        mainStore.resetSelectProduct()
    }, [flight]);

    return (

        <div className="flex bg-gray-100">

            {isAddProduct && <AddProductCard height={contentHeight}
                                             maxCol={maxCol}
                                             boardIdx={boardIdx}
                                             flight={flight}
                                             rowIdx={rowIdx}
                                             onClose={() => {
                                                 setIsAddProduct(false);

                                             }}></AddProductCard>}
            <div className="flex-1 ">
                <div
                    className={`flex flex-wrap`}
                >

                    {flight?.listSlot?.filter(f => f.bookingPlayerId)
                        .map((slot, colIndex) => {
                            return <div key={colIndex} className={`lg:w-1/${isAddProduct?(maxColLg): maxCol } xl:w-1/${maxCol}  md:w-1/2 ${colIndex==0? '':'pl-1'}`}>
                                <CardMemberBottom boardIdx={boardIdx}
                                                  height={contentHeight}
                                                  flight={flight} slot={slot}
                                                  isAddProduct={isAddProduct}
                                                  onAddProduct={() => {
                                                      setIsAddProduct(true)
                                                  }}
                                                  slotChange={(slotNew) => {
                                                      mainStore.updateSlotItem(boardIdx, rowIdx, slotNew);
                                                  }}/>
                            </div>
                        })
                    }
                    {slotAvailableIdx && <div className={`lg:w-1/${isAddProduct?(maxColLg): maxCol } xl:w-1/${maxCol}  md:w-1/2 pl-1`}>
                        <div className="w-full h-full">
                            <button

                                className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center
                                                     justify-center bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out"
                                onClick={() => {
                                    mainStore.openCreateModal({
                                        boardId: boardIdx,
                                        courseId: flight.courseId,
                                        playerNo: slotAvailableIdx,
                                        playDate: flight.playDate,
                                        startTime: flight.startTime,
                                    });
                                }}
                            >
                                                    <span className="text-6xl text-gray-400">
                                                        <PlusCircleFilled></PlusCircleFilled>
                                                    </span>
                            </button>
                        </div>

                    </div>}
                </div>
            </div>
        </div>

    );
};

export default observer(ListCardMemberBottom);
