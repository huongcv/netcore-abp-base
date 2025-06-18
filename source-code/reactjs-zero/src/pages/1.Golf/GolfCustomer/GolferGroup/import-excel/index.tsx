import { ArrowLeftOutlined } from "@ant-design/icons";
import { GolfBookingGroupImportDto, TplFileInfo } from "@api/index.defs";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";
import { IItemRoute, OrdBreadcrumb } from "@ord-components/common/page/PageBreadcrumb";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { Badge, Button, Card, Col, Row, Space, Tabs } from "antd";
import FileSaver from "file-saver";
import { observer } from "mobx-react-lite";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./index.scss";
import { BookingGroupDataTableExcel } from "./tableData";
import useReadExcelToData from "./useReadExcelToData";

const itemsRoute: IItemRoute[] = [
  {
    title: 'menu.golferGroup',
    route: '/app/golf/golfer-group'
  }
]

const ImportExcelProduct = () => {
  const { selectDataSourceStore } = useStore();
  const { t } = useTranslation("golf-customer-group");
  const [binaryStrExcel, setBinaryStrExcel] = useState("");
  const [validList, setValidList] = useState<GolfBookingGroupImportDto[]>([]);
  const [invalidList, setInvalidList] = useState<GolfBookingGroupImportDto[]>([]);
  const dataExcel = useReadExcelToData(binaryStrExcel);
  const [message, setMessage] = useState('');
  const [fileInfo, setFileInfo] = useState<TplFileInfo | undefined>();
  const [tabBarExtra, setTabBarExtra] = useState<ReactNode | null>();
  const [isShowTabBarExtra, setIsShowTabBarExtra] = useState<boolean>(false);
  const { t: tExcel } = useTranslation('excel');


  const handleDownloadTemplate = async () => {
    try {
      const response = await GolfBookingGroupService.exportTemplate({ responseType: "blob" });
      if (!response) throw new Error(t("excelAlert.errorDownload"));
      FileSaver.saveAs(response, t("fileExcel.FileImportName"));
    } catch {
      setMessage(t("excelAlert.errorDownload"));
    }
  };

  const handleValidateData = async (items: any[]) => {
    try {
      UiUtils.setBusy();
      const { successImportList, errorImportList, errorFile } = await GolfBookingGroupService.validateImport({
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
        <OrdBreadcrumb mainTitle={'menu.importGolferGroup'} itemsRoute={itemsRoute}></OrdBreadcrumb>
        <div className="flex items-center">
          <Space wrap>
            <Link to={'/app/golf/golfer-group'}>
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
                      <BookingGroupDataTableExcel
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
                      <BookingGroupDataTableExcel
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
