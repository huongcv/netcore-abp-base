import {SupportIcon} from "@ord-components/icon/SupportIcon";
import {Card} from "antd";
import React, {useEffect, useState} from "react";
import {SETTING_NAME_FOR_APP} from "@pages/Admin/Setting/setting-name.const";
import {SettingService} from "@api/SettingService";

function NewEventCard() {
    const [htmlText, setHtmlText] = useState<string>("")
    useEffect(() => {
        SettingService.getSettingForApp({
            name: 'App:Setting:HtmlTemplate.News'
        })
            .then(res => {
                setHtmlText(res);
            })
    }, []);
    return <>
        <Card size={"small"} className={'card-news px-3 h-full max-h-80 overflow-y-auto'}>
            <div className={'mt-2'}>
                <p className={'title-card-home title-dark font-bold'}>TIN TỨC SỰ KIỆN</p>
                <div dangerouslySetInnerHTML={{__html: htmlText}} className="2xl:max-w-2xl xl:max-w-lg lg:max-w-md md:max-w-md sm:max-w-96 content"/>
            </div>
        </Card>
    </>
}

export default NewEventCard
