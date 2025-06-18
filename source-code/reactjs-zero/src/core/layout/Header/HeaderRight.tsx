import {observer} from "mobx-react-lite";
import SwitchLangue from "@ord-core/layout/Header/SwitchLangue";
import UserTopBar from "@ord-core/layout/Header/UserTopBar";
import React from "react";
import {Space} from "antd";
import "./HeaderRight.scss";
import Notifications from "./Notifications";
import SwitchShop from "./SwitchShop";
import {HeaderSupport} from "@ord-core/layout/Header/Support";
import {useStore} from "@ord-store/index";
import QuickMenu from "./QuickMenu";
import { TenantType } from "@api/index.defs";
import EmployeeTimekeeping from "./TimeKeeping/EmployeeTimekeeping";

const HeaderRight = () => {
    const {sessionStore} = useStore();
    const isSuperAdmin = sessionStore.user?.isSuperAdmin;
    const tenantType : TenantType = sessionStore.user?.tenantDto?.type;
    return (
        <div className="header-right">
            <Space wrap className={"items-center justify-between style-child"}>
                <EmployeeTimekeeping buttonType={"button"} />
                <HeaderSupport/>
                {!isSuperAdmin && <SwitchShop/>}
                {/* <SwitchLangue/> */}
                <Notifications/>
                <UserTopBar/>
            </Space>
        </div>
    );
};
export default observer(HeaderRight);
