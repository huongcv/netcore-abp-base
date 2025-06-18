import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import "./ViewDetailPlayer.scss";
import UiUtils from "@ord-core/utils/ui.utils";
import {GolfLockerService} from "@api/GolfLockerService";
import {GolfLockerChangeHistoryDto} from "@api/index.defs";
import CardLockerBottom from "../ViewTeeTimeBottom/CardLockerBottom";
import {IViewDetailPlayerProps} from "@pages/1.Golf/TeeSheet/Booking/ViewDetailPlayer/ViewDetailPlayer";


const WrapCardLocker = (props: IViewDetailPlayerProps) => {
    const {flight, boardIdx, rowIdx, slot, colIdx} = props;
    const [lockerUseList, setLockerUseList] = useState<GolfLockerChangeHistoryDto>();

    useEffect(() => {
        const fetchDataLockerIsUse = async () => {
            const ids = flight?.listSlot
                ?.filter((f) => f.bookingPlayerId)
                .map((data, index) => Number(data.bookingPlayerId));
            if (ids?.length === 0) return;
            try {
                UiUtils.setBusy();
                const res = await GolfLockerService.getInfoLockerByBookingPlayerId({
                    body: slot.bookingPlayerId ? [Number(slot.bookingPlayerId)] : [],
                });
                if (res.length > 0) {
                    setLockerUseList(res[0]);
                } else {
                    setLockerUseList(undefined);
                }
            } catch (error) {
                console.error("Fetch lockers failed:", error);
            } finally {
                UiUtils.clearBusy();
            }
        };
        fetchDataLockerIsUse();
    }, [rowIdx]);

    const handleChangeLockerAssignedInrowIdx = (lockerId: string) => {
        if (!lockerUseList) return;
        lockerUseList.lockerId = lockerId;
        setLockerUseList({...lockerUseList});
    };

    return (
        <CardLockerBottom
            slotInfo={slot}
            boardIdx={boardIdx}
            lockerAssigned={lockerUseList}
            onChangeLockerAssignedInrowIdx={
                handleChangeLockerAssignedInrowIdx
            }
            flight={flight}
        />
    );
};

export default observer(WrapCardLocker);
