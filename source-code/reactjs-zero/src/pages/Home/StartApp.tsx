import React from 'react';
import {Col, Row} from "antd";
import {CloseOutlined, InfoCircleOutlined} from "@ant-design/icons";
import './home-style.scss';
import SliderCard from "@pages/Home/SliderCard";
import UpdateVersionCard from "@pages/Home/UpdateVersionCard";
import NewEventCard from "@pages/Home/NewEventCard";
import SupportCard from "@pages/Home/SupportCard";
import QuestionCard from "@pages/Home/QuestionCard";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import MaintenanceNotice from "@pages/Home/MaintenanceNotice";

function StartApp() {


    return <>
        <Row gutter={[16,16]}>
            <ColSpanResponsive span={24}>
                <MaintenanceNotice></MaintenanceNotice>
            </ColSpanResponsive>
            <ColSpanResponsive span={24}>
                <SliderCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={16}>
                <NewEventCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <UpdateVersionCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <SupportCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={16}>
                <QuestionCard/>
            </ColSpanResponsive>
        </Row>

    </>;
}

export default StartApp;
