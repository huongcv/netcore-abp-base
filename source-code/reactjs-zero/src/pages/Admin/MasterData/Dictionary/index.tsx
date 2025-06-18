import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterAndIsActived } from "@ord-components/forms/search/SearchFilterAndIsActived";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import tableUtil from "@ord-core/utils/table.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  TableColumnsType,
} from "antd";
import { useTranslation } from "react-i18next";
import SelectDictionaryTypeComponent, {
  DictionaryTypeEnum,
} from "./SelectDictionaryTypeComponent";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

const Dictionary: React.FC = () => {
  const { dictionaryStore: mainStore } = useStore();
  const columes: TableColumnsType<any> = tableUtil.getColumns(
    [
      {
        title: "Code",
        dataIndex: "code",
        width: 150,
      },
      {
        title: "Name",
        dataIndex: "name",
        width: 150,
      },
      {
        title: "filterDictionaryType",
        dataIndex: "dictionaryTypeId",
        render: (v: number) => DictionaryTypeEnum[v],
        width: 150,
      },
      {
        title: "PCode",
        dataIndex: "pCode",
        width: 150,
      },
      {
        title: "RelatedDictionaryCode",
        dataIndex: "relatedDictionaryCode",
      },
      {
        title: "RelatedDictionaryName",
        dataIndex: "relatedDictionaryName",
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d) => {
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d) => {
            mainStore.openRemoveById(d);
          },
        },
      ],
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const topActions: IActionBtn[] = [
    {
      title: "addNew",
      permission: "MasterData.Dictionary.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columes}
        searchForm={() => <SearchForm />}
        entityForm={(form) => <CreateOrUpdateForm form={form} />}
      ></OrdCrudPage>
    </>
  );
};

const SearchForm = () => {
  const [t] = useTranslation("dictionary");
  const [tCommon] = useTranslation();
  return (
    <>
      <Col {...useResponsiveSpan(6)}>
        <FloatLabel label={t("filterDictionaryType")}>
          <Form.Item name="filterDictionaryType">
            <SelectDictionaryTypeComponent
              allowClear={true}
              placeholder={tCommon("filterSelectCommonPlaceholder")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <SearchIsActived />
      <SearchFilterText />
    </>
  );
};
export const CreateOrUpdateForm = (props: { form: FormInstance }) => {
  const { t } = useTranslation("dictionary");
  const { t: tCommon } = useTranslation("common");

  return (
    <>
      <Form.Item label={t("Code")} name="code">
        <Input maxLength={10} placeholder={t("placeholderCode")} />
      </Form.Item>
      <Form.Item label={t("Name")} name="name" rules={[ValidateUtils.required]}>
        <Input maxLength={100} placeholder={t("placeholderName")} />
      </Form.Item>
      <Form.Item
        label={t("filterDictionaryType")}
        name="dictionaryTypeId"
        rules={[ValidateUtils.required]}
      >
        <SelectDictionaryTypeComponent
          allowClear={true}
          placeholder={tCommon("filterSelectCommonPlaceholder")}
        />
      </Form.Item>
      <div className="flex gap-4">
        <Form.Item className="w-6/12" label={t("NameOther")} name="nameOther">
          <Input maxLength={50} placeholder={t("placeholderNameOther")} />
        </Form.Item>
        <Form.Item
          className="w-6/12"
          label={t("OrderNumber")}
          name="orderNumber"
        >
          <Input type="number" maxLength={50} />
        </Form.Item>
      </div>
      <div className="flex gap-4">
        <Form.Item
          className="w-6/12"
          label={t("RelatedDictionaryCode")}
          name="relatedDictionaryCode"
        >
          <Input maxLength={50} />
        </Form.Item>
        <Form.Item
          className="w-6/12"
          label={t("RelatedDictionaryName")}
          name="relatedDictionaryName"
        >
          <Input maxLength={50} type="tel" />
        </Form.Item>
      </div>
      <Form.Item label={t("Notes")} name="notes">
        <Input maxLength={100} />
      </Form.Item>
      <Form.Item name="isActived" valuePropName="checked">
        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
      </Form.Item>
    </>
  );
};

export default Dictionary;
