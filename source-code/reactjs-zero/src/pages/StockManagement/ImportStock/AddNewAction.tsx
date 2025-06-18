import {PlusOutlined} from "@ant-design/icons";
import {HotKeyScope} from "@ord-core/AppConst";
import {Button, Space} from "antd";
import {useRef} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import Utils from "@ord-core/utils/utils";

export const ImportStockAddNewActionBtn = () => {
    const [t] = useTranslation("importStock");
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useHotkeys(
        "F2",
        (event) => {
            navigate(pathNameRef.current + "/import/add-new-supplier");
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );
    // useHotkeys(
    //   "F2",
    //   (event) => {
    //     navigate("/stock/import/add-new-other");
    //     event.preventDefault();
    //   },
    //   { scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true }
    // );
    return (
        <>
            {/* <Dropdown
        menu={{
          items: [
            {
              key: "1",
              label: (
                <Link to={"/stock/import/add-new-supplier"}>
                  <PlusOutlined /> {t("moveType101")} (F1)
                </Link>
              ),
            },
            {
              key: "2",
              label: (
                <Link to={"/stock/import/add-new-other"}>
                  <PlusOutlined /> {t("moveType102")} (F2)
                </Link>
              ),
            },
          ],
        }}
      ></Dropdown> */}
            {/* onClick={(e) => e.preventDefault()} */}
            <Link to={"add-new-supplier"}>
                <Button type="primary">
                    <Space>
                        <PlusOutlined/>
                        {/* <PlusOutlined /> {t("moveType101")} (F1) */}
                    </Space>
                    {t("actionBtn.addNew")} (F2)
                    {/* <DownOutlined style={{ fontSize: 16 }} /> */}
                </Button>
            </Link>
        </>
    );
};
