import {TimeSpan} from "@api/index.defs";
import dayjs from "dayjs";
import UiUtils from "@ord-core/utils/ui.utils";
import {CardIcon} from "@ord-components/icon/CardIcon";
import React from "react";
import GolfBookingStore from "@ord-store/Golf/TeeSheet/Booking/GolfBookingStore";

export function formatTime(time?: TimeSpan | string) {
    if (typeof time === "string") {
        return dayjs(time, "HH:mm:ss").format("HH:mm");
    } else {
        if (time) {
            return `${time.hours}:${time.minutes}`;
        }
    }
    return "-";
}

export function selectedRowName(boardIdx: number, rowIndex: number) {
    return `$board${boardIdx}_row${rowIndex}`;
}
export function slotName(boardIdx: number, rowIndex: number, colIndex: number) {
    return `slot-${boardIdx}-${rowIndex}-${colIndex}`;
}


export enum TeetimeSlotEnum {
    Available = 1,
    Booked = 2,
    Locked = 3,
    Maintenance = 4,
    Cancelled = 9,
    Invisude = 10
}
export enum CheckInStatusEnum {
    Notcheckedin = 1,
    Checkedin = 2,
    Late = 3,
    Noshow = 4
}
export enum  BookingStatusEnum {
    Pending = 1,
    Confirmed = 2,
    Cancelled = 3,
    Completed = 4,
    Paid = 5,
}

export enum  AccessCardStatusEnum {
    Available = 1,
    Assigned = 2,
    Lost = 3,
}
export enum AccessCardTypeEnum{
    Member = 1,
    Guest = 2,
    Temporary = 3,
    Staff = 4,
}
