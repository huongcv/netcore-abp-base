import React from 'react';
import {Button, Col, Dropdown, Layout, MenuProps, Row, Space} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined, MenuOutlined, SettingOutlined, SplitCellsOutlined} from "@ant-design/icons";
import {TopAction} from "@ord-components/crud/TopAction";
import ThemeUtil from "@ord-core/theme/ord-theme.config";
import {useStore} from "@ord-store/index";
import Notifications from "@ord-core/layout/Header/Notifications";
import './IndexFull.scss'
import {observer} from 'mobx-react-lite/src/observer';
import {useTranslation} from "react-i18next";
import InputQuickAccess from "@pages/1.Golf/TeeSheet/Booking/components/InputQuickAccess";
import TeeTimeWrapper from "@pages/1.Golf/TeeSheet/Valet/Scheduler/TeeTimeWrapper";

const headerHeight = 48;
const headerStyle: React.CSSProperties = {
    color: '#fff',
    height: headerHeight,
    paddingInline: 28,
    lineHeight: headerHeight + 'px',
    backgroundColor: '#fff',
    zIndex: 1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // hiệu ứng đổ bóng
};


function IndexFull() {
    const {golfBookingStore: mainStore, invoiceSettingStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {teeTimeMap} = mainStore
    const menuClose: MenuProps["items"] = [
        {
            label: (
                <Link to={"/app/golf/booking"}>
                    <ArrowLeftOutlined/> {"Trở về trang quản lý"}
                </Link>
            ),
            key: "0",
        },
        {
            label: (
                <a onClick={() => {
                    invoiceSettingStore.setVisibleSetting(true)
                }} type={"text"}>
                    <Space>
                        <SettingOutlined/> {t("settings")}
                    </Space>
                </a>
            ),
            key: "5",
        },
        {
            label: (
                <a onClick={() => {
                    mainStore.openCheckInModal();
                }} type={"text"}>
                    <Space>
                        <SettingOutlined/> {"Checkin/Checkout"}
                    </Space>
                </a>
            ),
            key: "CheckinCheckout",
        },

    ]

    const topAction: IActionBtn[] = [
        {
            content: <InputQuickAccess></InputQuickAccess>,
        },
        {
            content: <Button className="flex" onClick={() => {
                mainStore.newBoard();
            }}>
                <SplitCellsOutlined></SplitCellsOutlined>
            </Button>
        },
        {
            content: <Notifications className="notification flex"/>
        },
        {
            content: <Dropdown menu={{items: menuClose}} trigger={["hover"]}>
                <Button className="border-[#e5e7eb] flex">
                    <MenuOutlined/>
                </Button>
            </Dropdown>
        },

    ]

    const getFirstTeeTimeMap = (): { courseId?: string, playDate?: Date, boardId?: number } | null => {
        for (const [_, value] of Object.entries(teeTimeMap)) {
            const firstItem = value[0];
            if (firstItem?.courseId && firstItem?.playDate) {
                return {
                    courseId: firstItem.courseId,
                    playDate: firstItem.playDate,
                    boardId: 1 // bản chất boardId chỉ key của teeTimeMap => do ta lấy phần tử đầu nên boardId = 1
                }
            }
        }
        return null;
    };

    return (
        <Layout>
            <Header style={headerStyle}>
                <div className={'flex justify-between'}>
                    <div className='p-2'>

                        <Link to={'/'}>
                            <img id="logo-img"
                                 className={`h-[30px]`}
                                 src={ThemeUtil.getLogoUrl}
                                 alt="Logo"/>
                        </Link>


                    </div>
                    <div className={"flex justify-center items-center"}>
                        <TopAction topActions={topAction}/>
                    </div>
                </div>
            </Header>
            <Content>
                <TeeTimeWrapper></TeeTimeWrapper>

            </Content>
        </Layout>
    );
}

export default observer(IndexFull);
