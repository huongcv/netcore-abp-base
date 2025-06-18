import React from 'react';
import DragDropTeeTimeWrapper from "@pages/1.Golf/TeeSheet/Booking/Scheduler/DragDropTeeTimeWrapper";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {Button} from "antd";
import {FullscreenOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {CheckinIcon} from "@ord-components/icon/CheckinIcon";
import {useStore} from "@ord-store/index";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {useNavigate} from "react-router";


function Index() {
    const {golfBookingStore: mainStore} = useStore();
    const topAction: IActionBtn[] = [
        {
            content:
                <Button onClick={() => {
                    mainStore.openCheckInModal();
                }}>
                    {/*<FullscreenOutlined></FullscreenOutlined>*/}
                    <CheckinIcon></CheckinIcon> Checkin/Checkout (F2)
                </Button>
        },
        {
            content: <Link to={"full"}>
                <Button onClick={() => {
                }}>
                    <FullscreenOutlined></FullscreenOutlined>
                    {/*<FullscreenExitOutlined></FullscreenExitOutlined> */}
                    Mở rộng màn hình (F11)
                </Button>
            </Link>
        },


    ]
    const navigate = useNavigate();
    const scopeId = React.useMemo(() => `schedu-${Math.random().toString(36).substring(2, 15)}`, []);
    useHotkeys('F11', (event) => {
        navigate('full');
        event.preventDefault();
    }, {scopes: [scopeId], enableOnFormTags: true})

    return (
        <>
            <HotkeysProvider initiallyActiveScopes={[scopeId]}>
                <PageTopTitleAndAction>
                    <TopAction topActions={topAction}/>
                </PageTopTitleAndAction>
                <DragDropTeeTimeWrapper headerHeight={182}></DragDropTeeTimeWrapper>
            </HotkeysProvider>
        </>
    );
}

export default Index;
