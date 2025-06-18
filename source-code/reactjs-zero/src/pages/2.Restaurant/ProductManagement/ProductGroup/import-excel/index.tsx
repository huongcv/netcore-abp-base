import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProductGroupImportDto, TplFileInfo } from "@api/index.defs";
import { ProductGroupService } from "@api/ProductGroupService";
import { IItemRoute, OrdBreadcrumb } from "@ord-components/common/page/PageBreadcrumb";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { ProductGroupDataTableExcel } from "@pages/ProductManagement/ProductGroup/import-excel/tableData";
import useReadExcelToData from "@pages/ProductManagement/ProductGroup/import-excel/useReadExcelToData";
import { Badge, Button, Card, Col, Row, Space, Tabs } from "antd";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./index.scss";

const itemsRoute: IItemRoute[] = [
  {
    title: 'menu.product',
    route: '/product'
  }
]

const ImportExcelProduct = () => {
  const { selectDataSourceStore } = useStore();
  const { t } = useTranslation("product-group-list");
  const [binaryStrExcel, setBinaryStrExcel] = useState("");
  const [validList, setValidList] = useState<ProductGroupImportDto[]>([]);
  const [invalidList, setInvalidList] = useState<ProductGroupImportDto[]>([]);
  const dataExcel = useReadExcelToData(binaryStrExcel);
  const [message, setMessage] = useState('');
  const [fileInfo, setFileInfo] = useState<TplFileInfo | undefined>();
  const [tabBarExtra, setTabBarExtra] = useState<ReactNode | null>();
  const [isShowTabBarExtra, setIsShowTabBarExtra] = useState<boolean>(false);
  const { t: tExcel } = useTranslation('excel');


  const handleDownloadTemplate = async () => {
    try {
      const response = await ProductGroupService.exportTemplate({ responseType: "blob" });
      if (!response) throw new Error(t("excelAlert.errorDownload"));
      FileSaver.saveAs(response, t("fileExcel.FileImportName"));
    } catch {
      setMessage(t("excelAlert.errorDownload"));
    }
  };

  const handleValidateData = async (items: any[]) => {
    try {
      UiUtils.setBusy();
      const { successImportList, errorImportList, errorFile } = await ProductGroupService.validateImport({
        body: items,
      });
      setValidList(successImportList ?? []);
      setInvalidList(errorImportList ?? []);
      setFileInfo(errorFile);
      setMessage("");
    } catch {
      setMessage(t("uploadError"));
    } finally {
      UiUtils.clearBusy();
    }
  };

  useEffect(() => {
    setValidList([]);
    setInvalidList([]);
    if (dataExcel.data.length) handleValidateData(dataExcel.data);
    else if (!!binaryStrExcel && !dataExcel.data?.length) {
      setMessage(tExcel(dataExcel?.error ?? 'notDataOrIncorrectFile'));
    }
  }, [dataExcel.data]);

  const handleSetTabExtra = (content: ReactNode | null) => {
    setTabBarExtra(content);
    setIsShowTabBarExtra(!!content);
  };

  const handleChangeTab = (activeKey: string) => {
    setIsShowTabBarExtra(activeKey !== "2");
  };

  return (
    <>
      <div
        className="flex flex-wrap items-center justify-between mb-3">
        <OrdBreadcrumb mainTitle={'menu.importProductGroup'} itemsRoute={itemsRoute}></OrdBreadcrumb>
        <div className="flex items-center">
          <Space wrap>
            <Link to={'/product'}>
              <Button><ArrowLeftOutlined></ArrowLeftOutlined>{t('returnList', {
                ns: 'common'
              })}</Button>
            </Link>
          </Space>
        </div>
      </div>
      <Card title={t("importExcelTitle")}>
        <Row>
          <Col span={24}>
            <ImportExcelButton
              onChangeBinaryStr={setBinaryStrExcel}
              messageError={message}
              onClickDownloadTemplate={handleDownloadTemplate}
            />
          </Col>

          <Col span={24}>
            {binaryStrExcel && !message && dataExcel.data.length > 0 && (
              <Tabs
                defaultActiveKey="1"
                tabBarExtraContent={isShowTabBarExtra ? tabBarExtra : null}
                onChange={handleChangeTab}
                items={[
                  {
                    key: "1",
                    label: (
                      <>
                        {t("listValid", { ns: "excel" })}{" "}
                        <Badge color="green" className="ms-2" showZero count={validList.length} overflowCount={999999999} />
                      </>
                    ),
                    children: (
                      <ProductGroupDataTableExcel
                        datasource={validList}
                        isValid
                        setTabBarExtra={handleSetTabExtra}
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <>
                        {t("listInvalid", { ns: "excel" })}{" "}
                        <Badge color="red" className="ms-2" showZero count={invalidList.length} overflowCount={999999999} />
                      </>
                    ),
                    children: (
                      <ProductGroupDataTableExcel
                        datasource={invalidList}
                        setMessage={setMessage}
                        fileInfo={fileInfo}
                        isValid={false}
                      />
                    ),
                  },
                ]}
              />
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default observer(ImportExcelProduct);
