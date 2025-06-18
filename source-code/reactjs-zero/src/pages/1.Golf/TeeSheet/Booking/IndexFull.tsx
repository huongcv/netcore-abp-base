import React from 'react';
import {Button, Dropdown, Layout, MenuProps, Space, Tooltip} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Link} from "react-router-dom";
import {
    ArrowLeftOutlined,
    FullscreenExitOutlined,
    MenuOutlined,
    SettingOutlined,
    SplitCellsOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from "@ant-design/icons";
import DragDropTeeTimeWrapper from "@pages/1.Golf/TeeSheet/Booking/Scheduler/DragDropTeeTimeWrapper";
import {TopAction} from "@ord-components/crud/TopAction";
import ThemeUtil from "@ord-core/theme/ord-theme.config";
import {useStore} from "@ord-store/index";
import {CheckinIcon} from "@ord-components/icon/CheckinIcon";
import Notifications from "@ord-core/layout/Header/Notifications";
import './IndexFull.scss'
import { observer } from 'mobx-react-lite/src/observer';
import { GolfFlightOutputDto } from '@api/index.defs';
import SaleInvoiceSetting from "@pages/SalesInvoice/Sell/components/settings/saleInvoiceSetting";
import {useTranslation} from "react-i18next";
import InputQuickAccess from "@pages/1.Golf/TeeSheet/Booking/components/InputQuickAccess";

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
                <a onClick={()=>{
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
                <a onClick={()=>{
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
            content: <Tooltip title={'Đặt lịch'}>
                            <Button className="flex" onClick={() => {
                                const tee = getFirstTeeTimeMap();
                                    if(tee){
                                        mainStore.openCreateModal({
                                            courseId: tee.courseId,
                                            playDate: tee.playDate,
                                            isAutoGetTeeTime: true, // // stage cho việc booking icon user ở header indexFull
                                            //startTime: dayjs(props.value).startOf('day').toDate(),
                                    })
                                }
                                
                            }}>
                                <UserOutlined className='text-[20px]'/>
                            </Button>
                        </Tooltip>
        },
        {
            content: <Tooltip title={'Đặt lịch theo nhóm'}>
                            <Button className="flex" onClick={() => {
                                const tee = getFirstTeeTimeMap();
                                    if(tee){
                                        mainStore.openGroupBookingModal({
                                            boardId: tee.boardId ?? 1,
                                            playDate: tee.playDate,
                                            courseId: tee.courseId,
                                            playerNo: 1,
                                            startTime: undefined,
                                            // startTime: dayjs(props.value).startOf('day').toDate(),
                                    })
                                }
                            }}>
                                <UsergroupAddOutlined className='text-[20px]'/>
                            </Button>
                        </Tooltip>
        },
        {
            content: <Button className="flex" onClick={() => {
                mainStore.newBoard();
            }}>
                <SplitCellsOutlined></SplitCellsOutlined>
            </Button>
        },

        // {
        //     content: <Link to={"/app/golf/booking"}>
        //         <Button onClick={() => {
        //         }}>
        //             {/*<FullscreenOutlined></FullscreenOutlined>*/}
        //             <FullscreenExitOutlined></FullscreenExitOutlined>
        //         </Button>
        //     </Link>
        // },
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

    const getFirstTeeTimeMap = (): {courseId?: string,playDate?: Date,boardId?: number} | null => {
        const entries = Object.entries(teeTimeMap);
        if (entries.length === 0) return null;

        const [boardIdStr, flightList] = entries[0];
        const firstItem = flightList[0];

        return firstItem ? {
            courseId: firstItem.courseId,
            playDate: firstItem.playDate,
            boardId: Number(boardIdStr)
        } : null;
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
                <DragDropTeeTimeWrapper headerHeight={headerHeight}></DragDropTeeTimeWrapper>
            </Content>
        </Layout>
    );
}

export default observer(IndexFull);
