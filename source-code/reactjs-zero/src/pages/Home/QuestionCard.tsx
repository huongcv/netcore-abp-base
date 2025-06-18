import {Card, Collapse, CollapseProps, Divider} from "antd";
import React from "react";
import {QuestionIcon} from "@ord-components/icon/QuestionIcon";
import './home-style.scss'
import {MinusIcon} from "@ord-components/icon/MinusIcon";
import {AddIcon} from "@ord-components/icon/AddIcon";

function QuestionCard() {
    const text1 = 'Hệ thống có ứng dụng điện thoại dành cho cả iOS và Android. ' +
        'Quý khách có thể tìm kiếm trên App store hoặc CH play để tải về hoặc liên hệ với CSKH';

    const text2 = 'Hệ thống được thiết kế linh hoạt tuỳ theo nhu cầu của cửa hàng. ' +
        'Quý khách có thể tạo các sản phẩm không quản lý kho chỉ việc cấu hình giá bán và bán hàng một cách nhanh chóng.';

    const text3 = 'Hệ thống có phân hệ quản lý thu chi. ' +
        'Quý khách có thể tạo mới các loại thu chi tuỳ theo nhu cầu của cửa hàng để quản lý thu chi.';

    const text4 = 'Hệ thống có phân hệ khách hàng/nhà cung cấp. ' +
        'Quý khách có thể thông tin của khách hàng/nhà cung cấp cũng như xem được lịch sử công nợ và công nợ hiện tại của khách hàng/nhà cung cấp';

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <p className={'font-semibold d-flex items-center'}>
                <QuestionIcon className={'mr-1'}/> Hệ thống có ứng dụng điện thoại không?
            </p>,
            children: <div>{text1}</div>,
        },
        {
            key: '2',
            label: <p className={'font-semibold d-flex items-center'}>
                <QuestionIcon className={'mr-1'}/> Tôi có thể không cần quản lý kho cho sản phẩm không?
            </p>,
            children: <div>{text2}</div>,
        },
        {
            key: '3',
            label: <p className={'font-semibold d-flex items-center'}>
                <QuestionIcon className={'mr-1'}/> Tôi có thể quản lý thu/chi cho cửa hàng không?</p>,
            children: <div>{text3}</div>,
        },
        {
            key: '4',
            label: <p className={'font-semibold d-flex items-center'}>
                <QuestionIcon className={'mr-1'}/>Tôi có thể quản lý công nợ của khách hàng hay nhà cung cấp không?</p>,
            children: <div>{text4}</div>,
        },
    ];

    return <>
        <Card className={'h-full'}>
            <p className={'title-card-home title-dark font-bold mb-3'}>NHỮNG CÂU HỎI THƯỜNG GẶP</p>
            <Collapse
                defaultActiveKey={['1']}
                expandIconPosition={'end'}
                items={items}
                accordion
                bordered={false}
                style={{background: "white"}}
                expandIcon={({ isActive }) =>
                    isActive ? <MinusIcon /> : <AddIcon />}
            />
        </Card>
    </>
}

export default QuestionCard
