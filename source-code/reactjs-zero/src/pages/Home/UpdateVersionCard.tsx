import React, {useEffect, useState} from "react";
import {Card} from "antd";
import './home-style.scss'
import {SettingService} from "@api/SettingService";

function UpdateVersionCard() {
    // interface DummyData{
    //     time: string,
    //     content: string[]
    // }
    //
    // const itemsData : DummyData[] = [
    //     {
    //         time: '15/06/2024',
    //         content: [
    //             'Thêm tính năng tự động điền thông tin đối tượng khi tạo mới',
    //             'Dịch vụ thông báo biến động số dư tức thời Tingee liên kết với ngân hàng ABC'
    //         ]
    //     },
    //     {
    //         time: '15/06/2024',
    //         content: [
    //             'Thêm tính năng tự động điền thông tin đối tượng khi tạo mới',
    //             'Dịch vụ thông báo biến động số dư tức thời Tingee liên kết với ngân hàng ABC'
    //         ]
    //     },
    //     {
    //         time: '15/06/2024',
    //         content: [
    //             'Thêm tính năng tự động điền thông tin đối tượng khi tạo mới'
    //         ]
    //     }
    // ];
    // const listData = [];
    // for (let i = 0; i < itemsData.length; i++) {
    //     const listContent = [];
    //     for (let j = 0; j < itemsData[i]?.content.length; j++)
    //     {
    //         listContent.push(<li>{itemsData[i]?.content[j]}</li>)
    //     }
    //     listData.push(
    //         <div>
    //             <p className={'font-semibold mt-2'}>{itemsData[i]?.time}</p>
    //             <ul className={'dotted-list'}>
    //                 {listContent}
    //             </ul>
    //         </div>
    //     );
    // }
    const [htmlText, setHtmlText] = useState<string>("")
    useEffect(() => {
        SettingService.getSettingForApp({
            name: 'App:Setting:HtmlTemplate.UpdatedVersion'
        })
            .then(res => {
                setHtmlText(res);
            })
    }, []);
    return <>
        <Card size={"small"} className={'px-3 h-full max-h-80 overflow-y-auto'}>
            <div className={'mt-2'}>
                <p className={'title-card-home title-dark font-bold'}>PHIÊN BẢN CẬP NHẬT</p>
                <div dangerouslySetInnerHTML={{__html: htmlText}}/>
            </div>
        </Card>
    </>
}

export default UpdateVersionCard
