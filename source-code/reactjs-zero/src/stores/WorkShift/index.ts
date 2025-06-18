import ShopWorkShiftStore from "@ord-store/WorkShift/shopWorkShiftStore";
import shopWorkCalendarStore from "@ord-store/WorkShift/shopWorkCalendarStore";
import shopWorkCalendarDetailStore from "@ord-store/WorkShift/shopWorkCalendarDetailStore";

export const workShiftPart = {
    shopWorkShiftStore: new ShopWorkShiftStore(),
    shopWorkCalendarStore: new shopWorkCalendarStore(),
    shopWorkCalendarDetailStore: new shopWorkCalendarDetailStore(),
}
