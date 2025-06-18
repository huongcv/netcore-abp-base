import { ArrowLeftOutlined } from "@ant-design/icons";
import { TitleWithActionInRight } from "@ord-components/common/h-title/TitleWithActionInRight";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import ExcelFileUploadForm from "@pages/ProductManagement/Product/import-excel/ExcelFileUploadForm";
import { Button, Card, Row, Col } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ImportExcelDiscount = () => {
  const { t } = useTranslation("discount");
  const [binaryStrExcel, setBinaryStrExcel] = useState("");
  return (
    <>
      <TitleWithActionInRight title={t("importExcel")}>
        <Link to={"/product/discount"}>
          <Button>
            <ArrowLeftOutlined></ArrowLeftOutlined>
            {t("returnList", {
              ns: "common",
            })}
          </Button>
        </Link>
      </TitleWithActionInRight>
      <Card title={t("importExcelTitle")}>
        <Row>
          <Col span={24}>
            <ImportExcelButton
              onChangeBinaryStr={setBinaryStrExcel}
              urlDownloadTemplate={"/excels/mau-danh-sach-nhom-san-pham.xlsx"}
            ></ImportExcelButton>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default observer(ImportExcelDiscount);
