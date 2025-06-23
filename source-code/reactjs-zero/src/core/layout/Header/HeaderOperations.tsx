import {observer} from "mobx-react-lite";
import React, {useRef} from "react";
import {Button, Flex} from "antd";
import "./HeaderOperations.scss";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";
import {SaleIcon} from "@ord-components/icon/menu/SaleIcon";
import {SaleReturnIcon} from "@ord-components/icon/SaleReturnIcon";
import {useStore} from "@ord-store/index";
import Utils from "@ord-core/utils/utils";

const HeaderOperations = () => {
    const navigate = useNavigate();
    const {sessionStore} = useStore();
    const isSuperAdmin = sessionStore.user?.isSuperAdmin;
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));
    return (
        <div className="header-operations hidden ord-md:block">
            {!isSuperAdmin && (
                <>
                    <Flex gap="small" hidden={isSuperAdmin}>
                        <Button
                            className="btn-gray hover:shadow-xl"
                            onClick={() => navigate("/sales-invoice/sell")}
                            icon={<SaleIcon/>}
                        >
                            <span style={{lineHeight: "normal"}}>{t("Bán hàng")}</span>
                        </Button>
                        <Button
                            className="btn-gray hover:shadow-xl"
                            onClick={() => navigate("/sales-invoice/sell?return=1")}
                            icon={<SaleReturnIcon/>}
                        >
                            <span style={{lineHeight: "normal"}}>{t("Trả hàng")}</span>
                        </Button>
                      {/*  <Button
                            className="btn-gray hover:shadow-xl"
                            onClick={() => navigate(pathNameRef.current + "/import")}
                            icon={<ImportIcon/>}
                        >
                            <span style={{lineHeight: "normal"}}>{t("Nhập hàng")}</span>
                        </Button>*/}
                    </Flex>

                </>
            )}
        </div>
    );
};
export default observer(HeaderOperations);
