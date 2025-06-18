import {Tag} from "antd";

export const ShopWorkShiftStatusCell = (prop: {
    status?: number | null
}) => {
    return (prop?.status == 2 ?
        <Tag color={"red"}>
            {"Đã đóng"}
        </Tag>
        :
        <Tag color={"green"}>
            {"Đang diễn ra"}
        </Tag>);
}
