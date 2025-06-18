import { Form } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";

export const MoveTypeHeader = () => {
  const [t] = useTranslation("stock");
  const form = Form.useFormInstance();
  const moveType_w = Form.useWatch("moveType", form);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname) {
      const { pathname } = location;
      if (pathname.includes("stock/import/add-new-supplier")) {
        //form.setFieldValue('moveType', MoveType.PhieuNhapNhaCungCap);
      }
      if (pathname.includes("stock/import/add-new-other")) {
        //form.setFieldValue('moveType', MoveType.PhieuNhapTon);
      }
      if (pathname.includes("stock/export/add-new-supplier")) {
        form.setFieldValue("moveType", MoveType.PhieuXuatTraNhaCungCap);
      }
      if (pathname.includes("stock/export/add-new-other")) {
        form.setFieldValue("moveType", MoveType.PhieuXuatHuy);
      }
    }
  }, [location.pathname]);

  return (
    <>
      <Form.Item noStyle hidden name={"moveType"}></Form.Item>
      {/*{!!moveType_w && (*/}
      {/*  <h3 className={"move-title-header"}>*/}
      {/*    {t("moveTypeName." + moveType_w)}*/}
      {/*  </h3>*/}
      {/*)}*/}
    </>
  );
};
