import {Button, Dropdown} from "antd";
import {MenuProps} from "antd/lib";
import React from "react";
import {useNavigate} from "react-router";
import {AppExtendCode} from "@ord-core/AppConst";
import MenuUtils from "@ord-core/layout/menu.utils";
import {Link} from "react-router-dom";


const menuStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    width: "350px",
};

const itemStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "5px",
    cursor: "pointer",
};

const QuickMenu: React.FC = () => {
    const navigate = useNavigate();
    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <Link to={"/" + AppExtendCode.golf + "/dashboard"}>
                    <div style={itemStyle}>
                        <img
                            src="/images/golf.png"
                            alt="Golf"
                        />
                        <span style={{marginTop: "5px"}}>Golf</span>
                    </div>
                </Link>
            ),
        },
        {
            key: "2",
            label: (
                <Link to={"/" + AppExtendCode.restaurant + "/dashboard"}
                >
                    <div style={itemStyle}>
                        <img
                            src="/images/restaurant-building.png"
                            alt="Restaurant"
                        />
                        <span style={{marginTop: "5px"}}>Nhà hàng</span>
                    </div>
                </Link>
            ),
        },
        {
            key: "3",
            label: (
                <Link
                    to={"/" + AppExtendCode.hotel + "/dashboard"}
                >
                    <div style={itemStyle}>
                        <img
                            src="/images/hotel.png"
                            alt="Hotel"
                        />
                        <span style={{marginTop: "5px"}}>Khách sạn</span>
                    </div>
                </Link>
            ),
        },
        {
            key: "4",
            label: (
                <Link
                    to={"/"}
                >
                    <div style={itemStyle}>
                        <img
                            src="/images/shop.png"
                            alt="Proshop"
                        />
                        <span style={{marginTop: "5px"}}>Proshop</span>
                    </div>
                </Link>
            ),
        },
        {
            key: "5",
            label: (
                <div
                >
                    <div style={itemStyle}>
                        <img
                            src="/images/report.png"
                            alt="Report"
                        />
                        <span style={{marginTop: "5px"}}>Báo cáo</span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Dropdown
            menu={{items, style: menuStyle}}
            trigger={["click"]}
            placement="bottomRight"
        >
            <Button className={'btn-other border-0'} icon={<img src="/images/dots.png"/>} style={{marginTop: 17}}/>

        </Dropdown>
    );
};

export default QuickMenu;
