import React from "react";
import { Button, Col, Row, Splitter, Tabs } from "antd";
import { GolfFlightOutputDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import CardMemberBottom from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/CardMemberBottom";
import { observer } from "mobx-react-lite";
import DateUtil from "@ord-core/utils/date.util";
import {
  CalendarOutlined,
  CloseOutlined,
  FieldTimeOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import {
  formatTime,
  TeetimeSlotEnum,
} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import { GolferIcon } from "@ord-components/icon/GolferIcon";
import { LockerIcon } from "@ord-components/icon/LockerIcon";
import { BuggyIcon } from "@ord-components/icon/BuggyIcon";
import { CardTrustIcon } from "@ord-components/icon/CardTrustIcon";
import "./ViewTeeTimeBottom.scss";
import { Delete2Icon } from "@ord-components/icon/DeleteIcon";
import { IViewTeeTimeBottomProps } from "@pages/1.Golf/TeeSheet/Booking/ViewTeeTimeBottom/ViewTeeTimeBottom";
import BuggyBottomCard from "./BuggyBottomCard";

interface IListCardBuggyBottom extends IViewTeeTimeBottomProps {
  height: number;
}

const ListCardBuggyBottom = (props: IListCardBuggyBottom) => {
  const { golfBookingStore: mainStore } = useStore();
  const { flight, rowIdx, boardIdx, height } = props;
  const maxPlayer = flight?.maxGroupPerFlight ?? 4;
  const totalSlot =
    flight?.listSlot?.filter((f) => f.bookingPlayerId)?.length ?? 0;
  const headerHeight = 40;
  const contentHeight = height - headerHeight;

  return (
    <div className={`grid gap-4 grid-cols-${maxPlayer}`}>
      {flight?.listSlot
        ?.filter((f) => f.bookingPlayerId)
        .map((slot, colIndex) => {
          return (
            <div key={colIndex}>
              <BuggyBottomCard
                boardIdx={boardIdx}
                height={contentHeight}
                flight={flight}
                slot={slot}
                colIndex={colIndex}
              />
            </div>
          );
        })}
    </div>
  );
};

export default observer(ListCardBuggyBottom);
