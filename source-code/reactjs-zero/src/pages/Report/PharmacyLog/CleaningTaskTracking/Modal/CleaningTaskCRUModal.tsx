import { CleaningTaskDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import FormList from "antd/es/form/FormList";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import "../index.scss";
import ValidateUtils from "@ord-core/utils/validate.utils";

const { Title } = Typography;

const detailsFieldName = "cleaningTasks";

interface ICleaningTaskExtDto extends CleaningTaskDto {
  rowKey: number;
}
type ColumnTypes = Exclude<
  TableProps<ICleaningTaskExtDto>["columns"],
  undefined
>;

const CleaningTaskCRUModal = () => {
  const { cleaningTaskTrackingStore: mainStore } = useStore();
  const [daysInMonth, setDaysInMonth] = useState<CleaningTaskDto[]>([]);
  const { t } = useTranslation("cleaningTask");
  const form = Form.useFormInstance();
  const [loading, setLoading] = useState(false);

  const handleMonthChange = (date: Dayjs) => {
    if (date) {
      setLoading(true);
      setTimeout(() => {
        const r = renderColumes(date);
        setDaysInMonth(r);
        setLoading(false);
      }, 500);
    } else {
      setDaysInMonth([]);
    }
  };
  const renderColumes = (date: Dayjs): CleaningTaskDto[] => {
    const year = date.year();
    const month = date.month();

    const days: CleaningTaskDto[] = Array.from(
      { length: dayjs(date).daysInMonth() },
      (_, i) => ({
        key: i + 1,
        id: undefined,
        executionDate: new Date(year, month, i + 1), // Sử dụng Date object
        floorCleaned: false,
        shelvesCleaned: false,
        tablesChairsCleaned: false,
        fansAndAirConditionersCleaned: false,
        cabinetsCleaned: false,
        wallsAndCeilingsCleaned: false,
        medicineOrganized: false,
        cleaningTasksCompleted: false,
        performedById: "",
        inspectedById: "",
        notes: "",
        performedByName: "",
        inspectedByName: "",
      })
    );

    return days;
  };

  const handleCheckboxChange = (
    index: number,
    field: string,
    checked: boolean
  ) => {
    const currentFields = form.getFieldValue(detailsFieldName);
    const updatedFields = currentFields.map((item: any, idx: number) => {
      if (idx === index) {
        item[field] = checked;
      }
      return item;
    });

    // Update cleaningTasksCompleted if all fields are checked or unchecked
    const fieldsToUpdate = [
      "floorCleaned",
      "shelvesCleaned",
      "tablesChairsCleaned",
      "fansAndAirConditionersCleaned",
      "cabinetsCleaned",
      "wallsAndCeilingsCleaned",
      "medicineOrganized",
    ];

    if (field === "cleaningTasksCompleted") {
      fieldsToUpdate.forEach((field) => {
        updatedFields[index][field] = checked;
      });
      updatedFields[index].cleaningTasksCompleted = checked;
    } else {
      const allChecked = fieldsToUpdate.every(
        (field) => updatedFields[index][field]
      );
      updatedFields[index].cleaningTasksCompleted = allChecked;
    }

    form.setFieldsValue({ [detailsFieldName]: updatedFields });
  };

  const RenderEmp = (props: {
    employeeId: string | undefined;
    onChange: (
      value: any,
      option: IOrdSelectOption | IOrdSelectOption[]
    ) => void;
  }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<
      string | undefined
    >(
      props.employeeId && props.employeeId !== "" ? props.employeeId : undefined
    );

    const handleChange = (
      value: any,
      option: IOrdSelectOption | IOrdSelectOption[]
    ) => {
      setSelectedEmployeeId(value);
      props.onChange(value, option);
    };

    return (
      <OrdSelect
        onChange={handleChange}
        datasource={useSelectEmployee()}
        allowClear
        value={selectedEmployeeId}
      ></OrdSelect>
    );
  };

  useEffect(() => {
    if (mainStore.isAddNewEntity) {
      form.resetFields();
      setDaysInMonth([]);
    }
  }, [mainStore.createOrUpdateModal.visible]);

  const columns: ColumnTypes = [
    {
      title: t("executionDate"),
      dataIndex: "executionDate",
      key: "executionDate",
      render: (text: any, record, index) => {
        const date = dayjs(text);
        return (
          <>
            <Form.Item
              name={[index, "executionDate"]}
              initialValue={record.executionDate}
              hidden
            >
              <Input />
            </Form.Item>
            <span>{date.format("DD")}</span>
          </>
        );
      },
      width: 100,
      align: "center",
      fixed: "left",
    },
    {
      title: t("cleaningTasksCompleted"),
      dataIndex: "cleaningTasksCompleted",
      key: "cleaningTasksCompleted",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "cleaningTasksCompleted"]}
              initialValue={record.cleaningTasksCompleted}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "cleaningTasksCompleted",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
      fixed: "left",
    },
    {
      title: t("floorCleaned"),
      dataIndex: "floorCleaned",
      key: "floorCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "floorCleaned"]}
              initialValue={record.floorCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(index, "floorCleaned", e.target.checked)
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },
    {
      title: t("shelvesCleaned"),
      dataIndex: "shelvesCleaned",
      key: "shelvesCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "shelvesCleaned"]}
              initialValue={record.shelvesCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "shelvesCleaned",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },

    {
      title: t("tablesChairsCleaned"),
      dataIndex: "tablesChairsCleaned",
      key: "tablesChairsCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "tablesChairsCleaned"]}
              initialValue={record.tablesChairsCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "tablesChairsCleaned",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },
    {
      title: t("fansAndAirConditionersCleaned"),
      dataIndex: "fansAndAirConditionersCleaned",
      key: "fansAndAirConditionersCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "fansAndAirConditionersCleaned"]}
              initialValue={record.fansAndAirConditionersCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "fansAndAirConditionersCleaned",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },

    {
      title: t("cabinetsCleaned"),
      dataIndex: "cabinetsCleaned",
      key: "cabinetsCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "cabinetsCleaned"]}
              initialValue={record.cabinetsCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "cabinetsCleaned",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },
    {
      title: t("wallsAndCeilingsCleaned"),
      dataIndex: "wallsAndCeilingsCleaned",
      key: "wallsAndCeilingsCleaned",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "wallsAndCeilingsCleaned"]}
              initialValue={record.wallsAndCeilingsCleaned}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "wallsAndCeilingsCleaned",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },
    {
      title: t("medicineOrganized"),
      dataIndex: "medicineOrganized",
      key: "medicineOrganized",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "medicineOrganized"]}
              initialValue={record.medicineOrganized}
              valuePropName="checked"
            >
              <Checkbox
                onChange={(e) =>
                  handleCheckboxChange(
                    index,
                    "medicineOrganized",
                    e.target.checked
                  )
                }
              />
            </Form.Item>
          </>
        );
      },
      width: 100,
      align: "center",
    },

    {
      title: t("performedById"),
      dataIndex: "performedById",
      key: "performedById",
      render(_, record, index) {
        return (
          <>
            <Form.Item name={[index, "performedById"]}>
              <div style={{ textAlign: "left" }}>
                <RenderEmp
                  onChange={(val: string) => {
                    form.setFieldValue(
                      [detailsFieldName, index, "performedById"],
                      val
                    );
                  }}
                  employeeId={record.performedById}
                />
              </div>
            </Form.Item>
          </>
        );
      },
      width: 200,
      align: "center",
    },
    {
      title: t("inspectedById"),
      dataIndex: "inspectedById",
      key: "inspectedById",
      render(_, record, index) {
        return (
          <>
            <Form.Item name={[index, "inspectedById"]}>
              <div style={{ textAlign: "left" }}>
                <RenderEmp
                  onChange={(val: string) => {
                    form.setFieldValue(
                      [detailsFieldName, index, "inspectedById"],
                      val
                    );
                  }}
                  employeeId={record.inspectedById}
                />
              </div>
            </Form.Item>
          </>
        );
      },
      width: 200,
      align: "center",
    },
    {
      title: t("notes"),
      dataIndex: "notes",
      key: "notes",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "notes"]}
              initialValue={record.notes || ""}
            >
              <Input />
            </Form.Item>
          </>
        );
      },
      align: "center",
    },
  ];
  return (
    <>
      <Title level={4}>{t("pickMonth")}</Title>
      <Form.Item name="day" rules={[ValidateUtils.required]}>
        <DatePicker
          onChange={handleMonthChange}
          picker="month"
          disabled={mainStore.entityUpdateData != null}
          format="MM/YYYY"
          disabledDate={(current) => {
            return current && current.isAfter(dayjs(), "month");
          }}
        />
      </Form.Item>
      <FormList name={detailsFieldName}>
        {(fields) => {
          return (
            <Table<ICleaningTaskExtDto>
              dataSource={
                mainStore.entityUpdateData == null
                  ? daysInMonth
                  : fields.map((field, index) => {
                      return {
                        ...form.getFieldValue([detailsFieldName, index]),
                        rowKey: "" + field.key,
                      };
                    })
              }
              columns={columns as ColumnTypes}
              pagination={false}
              rowKey={(d) => `${d.rowKey}`}
              scroll={{ x: "max-content" }}
              loading={loading}
              className="custom-table"
              bordered
              sticky
            />
          );
        }}
      </FormList>
    </>
  );
};

export default CleaningTaskCRUModal;
