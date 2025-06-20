import {Button, Dropdown} from "antd";
import {CaretRightOutlined} from "@ant-design/icons";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import {useStore} from "@ord-store/index";
import {ShopType} from "@ord-core/model/side-nav.type";

export const HeaderSupport = () => {
    const { sessionStore } = useStore();

    const supports = useMemo(() => {
        const baseSupports = [
            {
                title: "Chứng nhận kết nối Dược Quốc gia",
                content: "Vui lòng bấm vào để xem chi tiết",
                url: "https://dav.gov.vn/cong-bo-cac-don-vi-cung-cap-phan-mem-ket-noi-va-chuyen-du-lieu-thanh-cong-vao-he-thong-co-so-du-lieu-duoc-quoc-gia-den-ngay-20062023-n3991.html"
            },
            {
                title: "Hướng dẫn sử dụng phần mềm",
                content: "SDT: 0983.542.221"
            },
            {
                title: "Hỗ trợ từ xa",
                content: "Tải xuống phần mềm ultraview",
                url: "https://www.ultraviewer.net/vi/download.html"
            }
        ];

        if (sessionStore.appSession.currentShopType !== ShopType.NhaThuoc) {
            return baseSupports.slice(1);
        }

        return baseSupports;
    }, [sessionStore.appSession.currentShopType]);

    const supportMenuItems = useMemo(() => {
        return supports.map((it, idx) => ({
            label: (
                <div className="flex">
                    <div className="flex flex-col w-[250px]">
                        {it.url ? (
                            <Link
                                to={it.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-0 whitespace-normal"
                            >
                                <h5 className="font-semibold">
                                    <CaretRightOutlined /> {it.title}
                                </h5>
                                {it.content}
                            </Link>
                        ) : (
                            <>
                                <h5 className="font-semibold">
                                    <CaretRightOutlined /> {it.title}
                                </h5>
                                <div className="mt-0 whitespace-normal">{it.content}</div>
                            </>
                        )}
                    </div>
                </div>
            ),
            key: idx
        }));
    }, [supports]);

    return (
        <Dropdown menu={{ items: supportMenuItems }} placement="bottomRight">
            <Button className="btn-other border-0" icon={<IconlyLight type={"Support.svg"} />}>
                <span>Hỗ trợ</span>
            </Button>
        </Dropdown>
    );
};
