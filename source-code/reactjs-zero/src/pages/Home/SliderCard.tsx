import {Carousel, Col, Row} from "antd";
import React from "react";
import './home-style.scss';
import {useStore} from "@ord-store/index";
import OrdThemeConfig from "@ord-core/theme/ord-theme.config";

function SliderCard() {
    const {sessionStore} = useStore();
    const {currentShopName} = sessionStore;
    const dashboardSlider = OrdThemeConfig.dashboardSlider;


    if(dashboardSlider && dashboardSlider.length> 0){
        return <Carousel  autoplay className={'ord-slider-dashboard'}>
            {dashboardSlider.map(x=> {
                return <div key={x} className={'slider'}>
                    <img  src={x}/>
                </div>
            })}
        </Carousel>
    }else{
        const sysName = OrdThemeConfig.systemName;
        return <Carousel autoplay>
            <div>
                <div className={'slider background-1'}>
                    <Row className={'d-flex content-center'}>
                        <Col>
                            <p className={'title-slider-extra title-light'}>Xin chào, {currentShopName}</p>
                        </Col>
                        <Col span={24}>
                            <p className={'title-slider title-light uppercase'}>{sysName}</p>
                        </Col>
                    </Row>
                </div>
            </div>
            <div>
                <div className={'slider background-3'}>
                    <Row className={'d-flex content-center'}>
                        <Col>
                            <p className={'title-slider-extra title-dark'}>Xin chào, {currentShopName}</p>
                        </Col>
                        <Col span={24}>
                            <p className={'title-slider title-primary uppercase'}>{sysName}</p>
                        </Col>
                    </Row>
                </div>
            </div>
        </Carousel>
    }
}

export default SliderCard;
