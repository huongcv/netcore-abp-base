import {observer} from "mobx-react-lite";
import UserTopBar from "@ord-core/layout/Header/UserTopBar";
import React from "react";
import {Space} from "antd";
import "./HeaderRight.scss";
import {HeaderSupport} from "@ord-core/layout/Header/Support";
import {useStore} from "@ord-store/index";
import EmployeeTimekeeping from "./TimeKeeping/EmployeeTimekeeping";
import HeaderNotifications from "@ord-core/layout/Header/Notification/HeaderNotifications";

const HeaderRight = () => {
    const {sessionStore} = useStore();
    return (
        <div className="header-right">
            <Space wrap className={"items-center justify-between style-child"}>
                <EmployeeTimekeeping buttonType={"button"} />
                <HeaderSupport/>
                {/* <SwitchLangue/> */}
                <HeaderNotifications/>
                <UserTopBar/>
            </Space>
        </div>
    );
};
export default observer(HeaderRight);
