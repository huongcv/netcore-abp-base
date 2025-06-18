import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import "./ViewTeeTimeBottom.scss";
import { IViewTeeTimeBottomProps } from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ViewTeeTimeBottom";
import CardLockerBottom from "./CardLockerBottom";
import UiUtils from "@ord-core/utils/ui.utils";
import { GolfLockerService } from "@api/GolfLockerService";
import { GolfLockerChangeHistoryDto } from "@api/index.defs";
import { forEach } from "lodash";

interface IListCardMemberBottom extends IViewTeeTimeBottomProps {
  height: number;
}

const ListCardLockerBottom = (props: IListCardMemberBottom) => {
  const { golfBookingStore: mainStore } = useStore();
  const { flight, boardIdx, height, rowIdx } = props;
  const maxPlayer = flight?.maxGroupPerFlight ?? 4;
  const headerHeight = 40;
  const contentHeight = height - headerHeight;
  const [lockerUseList, setLockerUseList] = useState<
    Record<string, GolfLockerChangeHistoryDto>
  >({});
  const [keyActivedTeeTimeChange, setKeyActivedTeeTimeChange] =
    useState<number>(0);

  useEffect(() => {
    setLockerUseList({});
    setKeyActivedTeeTimeChange((pre) => pre + 1);

    const fetchDataLockerIsUse = async () => {
      const ids = flight?.listSlot
        ?.filter((f) => f.bookingPlayerId)
        .map((data, index) => Number(data.bookingPlayerId));
      if (ids?.length === 0) return;
      try {
        UiUtils.setBusy();
        const res = await GolfLockerService.getInfoLockerByBookingPlayerId({
          body: ids,
        });
        if (res.length > 0) {
          const map: Record<string, GolfLockerChangeHistoryDto> = {};
          res.forEach((lockerIsUse) => {
            if (lockerIsUse.bookingPlayerId) {
              map[lockerIsUse.bookingPlayerId.toString()] = lockerIsUse;
            }
          });
          setLockerUseList(map);
        }
      } catch (error) {
        console.error("Fetch lockers failed:", error);
      } finally {
        UiUtils.clearBusy();
      }
    };
    fetchDataLockerIsUse();
  }, [rowIdx]);

  const handleChangeLockerAssignedInrowIdx = (lockerId: any) => {
    const updatedList = Object.fromEntries(
      Object.entries(lockerUseList).filter(
        ([_, value]) => value.lockerId !== lockerId
      )
    );
    setLockerUseList({ ...updatedList });
    setKeyActivedTeeTimeChange((prev) => prev + 1);
  };

  return (
    <div className={`grid gap-4 grid-cols-${maxPlayer}`}>
      {flight?.listSlot
        ?.filter((f) => f.bookingPlayerId)
        .map((slot, colIndex) => {
          return (
            <CardLockerBottom
              key={colIndex + keyActivedTeeTimeChange}
              slotInfo={slot}
              height={contentHeight}
              boardIdx={boardIdx}
              lockerAssigned={
                slot.bookingPlayerId
                  ? lockerUseList[slot.bookingPlayerId.toString()]
                  : undefined
              }
              onChangeLockerAssignedInrowIdx={
                handleChangeLockerAssignedInrowIdx
              }
              flight={flight}
            />
          );
        })}
    </div>
  );
};

export default observer(ListCardLockerBottom);
