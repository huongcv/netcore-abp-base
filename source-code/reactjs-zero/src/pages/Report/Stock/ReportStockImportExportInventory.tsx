import React, { useEffect } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { StockReportPageListImportExportInventoryOutputDto } from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { debounce } from "lodash";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import { observer } from "mobx-react-lite";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useNavigate } from "react-router-dom";
import { withDataTableFetching } from "@ord-core/hoc/withDataTableFetching";
import { TableProps } from "antd/es/table/InternalTable";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useSelectStock } from "@ord-components/forms/select/selectDataSource/useSelectStock";
import Utils from "@ord-core/utils/utils";
import TableImportExportInventory from "@pages/Report/Stock/TableImportExportInventory";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

function ReportStockImportExportInventory() {
  const { reportStockImportExportInventoryStore: stored } = useStore();
  const { t } = useTranslation(stored.getNamespaceLocale());
  const [searchFormRef] = Form.useForm();

  // useHotkeys(
  //   "F3",
  //   (event) => {
  //     searchFormRef.submit();
  //     event.preventDefault();
  //   },
  //   { scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true }
  // );

  useEffect(() => {
    if (stored) {
      searchFormRef.setFields([
        {
          name: "rangeDate",
          value: DateUtil.getDateRange("thang_nay"),
        },
      ]);
      stored.setSearchFormRef(searchFormRef);
    }
  }, []);

  const navigate = useNavigate();
  function onResetClick() {
    searchFormRef.resetFields();
    searchFormRef.setFields([
      {
        name: "rangeDate",
        value: DateUtil.getDateRange("thang_nay"),
      },
    ]);
    stored.searchData({});
  }

  const topAction: IActionBtn[] = [
    {
      content: (
        <>
          <Button onClick={() => navigate(-1)}>
            <Space>
              <ArrowLeftOutlined />
            </Space>
            {t("actionBtn.back")}
          </Button>
        </>
      ),
    },
    {
      content: (
        <Button
          type="primary"
          onClick={() => {
            stored.exportExcelPagedResult().then((res) => {});
          }}
        >
          <Space>
            <ExportOutlined />
          </Space>
          {t("actionBtn.exportExcel")}
        </Button>
      ),
    },
  ];

  useHotkeys("F3", (event) => {
      event.preventDefault();
      const input = document.querySelector(
          'input[placeholder="' + t('searchPlaceHolder') + '"]'
      ) as HTMLInputElement;

      if (input) {
          input.focus();
      }
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
  );

  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1"), t("titlePageLvl2")]}
      >
        <TopAction topActions={topAction} />
      </PageTopTitleAndAction>
      <Form
        className={"ord-container-box"}
        form={searchFormRef}
        layout={"vertical"}
        onFinish={debounce((d) => {
          console.log("d", d);
          stored.searchData(d);
        }, 250)}
      >
        <Row gutter={16}>
          <Col lg={8} md={12}>
            <FloatLabel label={t("rangeDate")}>
              <Form.Item name="rangeDate" className="flex-auto">
                <OrdDateRangeInput allowClear={false}></OrdDateRangeInput>
              </Form.Item>
            </FloatLabel>
          </Col>
          {/* <Col lg={4} md={12}>
                        <FloatLabel label={t('isActived')}>
                            <Form.Item name='isActived' className='flex-auto'>
                                <OrdSelect allowClear datasource={useSelectIsActived()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col> */}
          {/* <Col lg={4} md={12}>
            <FloatLabel label={t("inventoryId")}>
              <Form.Item name="inventoryId" className="flex-auto">
                <OrdSelect allowClear datasource={useSelectStock()}></OrdSelect>
              </Form.Item>
            </FloatLabel>
          </Col> */}
          <Col {...useResponsiveSpan(10)}>
            {/* <Space.Compact style={{ width: "100%" }}>
              <Form.Item name="filter" className="flex-auto">
                <Input allowClear placeholder={t("searchPlaceHolder")} />
              </Form.Item>
              <Button type="primary" htmlType={"submit"}>
                <SearchOutlined />
              </Button>
              <Button type="default" onClick={onResetClick}>
                <RedoOutlined />
              </Button>
            </Space.Compact> */}
            <SearchFilterText onReset={onResetClick} span={24}/>
          </Col>
        </Row>
      </Form>
      <TableImportExportInventory stored={stored}></TableImportExportInventory>
    </>
  );
}
export default observer(ReportStockImportExportInventory);
