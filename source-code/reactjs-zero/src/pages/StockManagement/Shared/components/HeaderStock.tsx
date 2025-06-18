import React from 'react';
import {Button, Space} from "antd";
import {HomeIcon} from "@ord-components/icon/HomeIcon";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

const HeaderStock = (props: {
    title: string,
    returnUrl: string,
    subTitle: string,
}) => {
    const {title, subTitle, returnUrl} = props;
    const [t] = useTranslation("stock");
    return (
        <div
            className="flex flex-wrap items-center justify-between leading-[1.8571428571] gap-y-[15px] gap-x-[30px] max-sm:flex-col">
            <h4 className="text-dark text-[20px] font-semibold">
                <Space className={"title"}>
                    <HomeIcon/>
                </Space>
                <Space className={"title"}>
                    <IconlyLight
                        className={"mx-1 mt-[6px]"}
                        width={20}
                        type={"Arrow - Right 2.png"}
                    ></IconlyLight>
                </Space>

                <span>
                    <Link to={returnUrl}>
                      {title}
                    </Link>
                </span>
                <span className="mx-2 ">
                    <IconlyLight
                        className={"mx-1 mt-[6px]"}
                        width={20}
                        type={"Arrow - Right 2.png"}
                    ></IconlyLight>
                  </span>

                <span>
                    {subTitle}
                </span>
            </h4>

            <div className="flex items-center pt-1 mb-1">
                <Link to={returnUrl}>
                    <Button>
                        <ArrowLeftOutlined></ArrowLeftOutlined>
                        {t("returnList")} (F10)
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default HeaderStock;