import { useStore } from "@ord-store/index";
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {
  DateRangeDto,
  GolfCourseMaintenanceLogDto,
  OrdGolfCourseMaintenanceLogPagedRequestDto,
  PagedResultDtoOfGolfCourseMaintenanceLogDto,
} from "@api/index.defs";
import { useEffect, useState } from "react";
import { IconlyLightSearch } from "@ord-components/icon/IconlyLightSearch";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { debounce } from "lodash";
import DateUtil from "@ord-core/utils/date.util";

export const TabCourseMaintenance = (props: {
  courseId: string | undefined;
}) => {
  const { golfMaintenanceStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [data, setData] =
    useState<PagedResultDtoOfGolfCourseMaintenanceLogDto>();
  const [loading, setLoading] = useState(false);

  const [filterText, setFilterText] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeDto>();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns: TableColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "stt",
      align: "center",
      width: 10,
      render: (_: any, __: any, index: number) => {
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: t("maintenanceDate"),
      dataIndex: "maintenanceDate",
      align: "left",
      width: 100,

      render: (v) => DateUtil.toFormat(v),
    },
    {
      title: t("notes"),
      dataIndex: "notes",
      align: "left",
      width: 200,
    },
    {
      title: t("performedName"),
      dataIndex: "performedName",
      align: "left",
      width: 100,
    },
  ];
  const SearchForm = () => {
    return (
      <>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <OrdDateRangeInput
              allowClear
              labelMode={"fromToLabel"}
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>
          <Col span={8}>
            <FloatLabel label={t("filterSearch")}>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  prefix={<IconlyLightSearch />}
                  placeholder={t("filterSearch")}
                  allowClear
                  onChange={debounce((e) => setFilterText(e.target.value), 250)}
                />
                <Tooltip placement="top" title={t("refreshDataTable")}>
                  <Button
                    className={"btn-other"}
                    type="default"
                    style={{ width: 44, height: 39 }}
                    icon={<IconlyLight width={22} type={"Reload.svg"} />}
                    onClick={debounce(resetClick, 250)}
                  ></Button>
                </Tooltip>
              </Space.Compact>
            </FloatLabel>
          </Col>
          <Col span={4}>
            <Tooltip placement="top" title={t("search")}>
              <Button
                type="primary"
                className={"search-btn"}
                onClick={debounce(onSearch, 250)}
                icon={
                  <>
                    <IconlyLight width={22} type={"Search.svg"} />
                  </>
                }
              ></Button>
            </Tooltip>
          </Col>
        </Row>
      </>
    );
  };

  const onSearch = () => {
    setCurrent(1);
    fetchData(1, pageSize);
  };
  const fetchData = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const request: OrdGolfCourseMaintenanceLogPagedRequestDto = {
        skipCount: (page - 1) * size,
        maxResultCount: size,
        filter: filterText,
        dateRange: dateRange,
        courseId: props.courseId,
      };
      const res = await mainStore.apiService().getPaged({ body: request }, {});
      setData({ items: res.items, totalCount: res.totalCount as any });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (props.courseId) {
      fetchData(current, pageSize);
    }
  }, [props.courseId]);
  const resetClick = () => {};
  return (
    <>
      <SearchForm />
      <Table<GolfCourseMaintenanceLogDto>
        bordered
        rowKey="id"
        dataSource={data?.items}
        columns={columns}
        loading={loading}
        rowClassName="editable-row"
        pagination={{
          current,
          pageSize,
          total: Number(data?.totalCount) || 0,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
            fetchData(page, size);
          },
        }}
      />
    </>
  );
};
