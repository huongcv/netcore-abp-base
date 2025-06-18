import React, {useEffect, useState} from "react";
import './home-style.scss'
import {SettingService} from "@api/SettingService";
import {CloseOutlined, InfoCircleOutlined} from "@ant-design/icons";

function MaintenanceNotice() {
    const [isShow, setIsShow] = useState<boolean>(true)
    const [htmlText, setHtmlText] = useState<string>("")
    useEffect(() => {
        SettingService.getSettingForApp({
            name: 'App:Setting:HtmlTemplate.MaintenanceNotice'
        })
            .then(res => {
                setIsShow(!!res);
                setHtmlText(res);
            })
    }, []);
    return <>
        {isShow && <div className={'px-2 py-1 notify-card'}>
            <div className={'d-flex justify-between item-center'}>
                <div className={'d-flex item-center'}>
                    <InfoCircleOutlined className={'p-2 h-8 icon-notify mr-2'}/>
                    <div>
                        <div dangerouslySetInnerHTML={{__html: htmlText}}/>
                    </div>
                </div>
                <a className={'mr-3'} onClick={() => {
                    setIsShow(false)
                }}>
                    <CloseOutlined></CloseOutlined>
                </a>
            </div>
        </div>}
    </>
}

export default MaintenanceNotice
