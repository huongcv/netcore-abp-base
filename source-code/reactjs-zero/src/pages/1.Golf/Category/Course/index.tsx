import {
  CourseTypeEnum,
  FieldStatusEnum,
  GolfCourseDto,
} from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { Form, Row, TableColumnsType, Tag } from "antd";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectCourseType } from "@ord-components/forms/select/selectDataSource/useSelectCourseType";
import { useSelectGolfCourseCurrentStatus } from "@ord-components/forms/select/selectDataSource/useSelectGolfCourseCurrentStatus";
import CourseEntityForm from "./CourseEntityForm";
import { GolfAreaBtnGroup } from "./GolfAreaBtnGroup";
import ModalCreateMaintenanceLog from "./ModalCreateMaintenanceLog";
import { useCallback, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import "./index-course.scss";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

interface CourseMaintenanceLog {
  courseId: string | undefined;
  isOpen: boolean;
}
const GolfCourse: React.FC = () => {
  const { golfCourseStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");
  const [isOpenModalLog, setIsOpenModalLog] = useState<CourseMaintenanceLog>({
    courseId: undefined,
    isOpen: false,
  });

  const CurrenStatus = ({ status }: { status?: FieldStatusEnum }) => {
    if (!status) return <></>;
    let className;
    let text;
    switch (status) {
      case 1:
        className =
          "p-1 px-2 border-solid cls-status-active text-center min-w-[130px]";
        text = tCommon("FieldStatusEnum.Active");
        break;
      case 2:
        className =
          "p-1 px-2 border-solid cls-status-maintenance text-center min-w-[130px]";
        text = tCommon("FieldStatusEnum.Maintenance");
        break;
      case 3:
        className =
          "p-1 px-2 border-solid cls-status-closed text-center min-w-[130px]";
        text = tCommon("FieldStatusEnum.Closed");
        break;
      case 4:
        className =
          "p-1 px-2 border-solid cls-status-closed text-center min-w-[130px]";
        text = tCommon("FieldStatusEnum.Unactive");
        break;
    }
    return <Tag className={className}>{text}</Tag>;
  };

  const columns: TableColumnsType<GolfCourseDto> = TableUtil.getColumns(
    [
      {
        title: t("code"),
        dataIndex: "code",
        align: "left",
        width: 80,
      },
      {
        title: t("name"),
        dataIndex: "name",
        align: "left",
        width: 150,
      },
      // {
      //   title: t("holeCount"),
      //   dataIndex: "holeCount",
      //   align: "center",
      //   width: 50,
      // },
      {
        title: t("areaName"),
        dataIndex: "areaName",
        align: "left",
        width: 150,
      },
      {
        title: t("courseType"),
        width: 100,
        dataIndex: "courseType",
        render: (v: CourseTypeEnum) => {
          return v ? <>{tCommon(`CourseTypeEnum.${v}`)}</> : <></>;
        },
      },
      {
        title: t("description"),
        dataIndex: "description",
        width: 200,
        render: (v) => (
          <TextLineClampDisplay content={v} className="!font-medium" />
        ),
      },
      {
        title: t("currentStatus"),
        dataIndex: "currentStatus",
        width: 150,
        align: "center",
        render: (v) => <CurrenStatus status={v} />,
      },
    ],
    {
      actions: [
        {
          title: "create-maintenamce-log",
          icon: <PlusOutlined />,
          onClick: (d) => {
            setIsOpenModalLog({ courseId: d.id, isOpen: true });
          },
        },
        {
          title: "remove",
          onClick: (d: GolfCourseDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfCourseDto>[],
      viewAction: (d) => {
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
      widthRowIndexCol: 50,
      widthActionCol: 100,
    }
  );

  const topActions: IActionBtn[] = [
    {
      title: "btnGolfArea",
      content: <GolfAreaBtnGroup />,
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
    {
      title: "addNew",
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  const SearchForm = useCallback(() => {
    return (
      <>
        {/* <ColSpanResponsive span={4}>
          <FloatLabel label={t("date")}>
            <Form.Item name="date">
              <OrdDateInput allowClear placeholder={t("date")} />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive> */}
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("courseType")}>
            <Form.Item name="courseType">
              <OrdSelect
                datasource={useSelectCourseType()}
                allowClear
                placeholder={t("courseType")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("currentStatus")}>
            <Form.Item name="currentStatus">
              <OrdSelect
                datasource={useSelectGolfCourseCurrentStatus()}
                allowClear
                placeholder={t("currentStatus")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <SearchFilterText span={8} />
      </>
    );
  }, []);
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        // contentTopTable={
        //   <span className="text-lg font-bold mb-10">
        //     {t("titleCourseList")}
        //   </span>
        // }
        entityForm={() => <CourseEntityForm />}
        searchForm={(f) => <SearchForm />}
        columns={columns}
        topActions={topActions}
      ></OrdCrudPage>
      <ModalCreateMaintenanceLog
        isOpen={isOpenModalLog?.isOpen}
        courseId={isOpenModalLog?.courseId}
      ></ModalCreateMaintenanceLog>
    </>
  );
};
export default GolfCourse;
