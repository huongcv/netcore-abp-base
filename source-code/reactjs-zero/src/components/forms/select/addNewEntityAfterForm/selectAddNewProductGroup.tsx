import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import { useStore } from "@ord-store/index";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import { useSelectProductGroup } from "@ord-components/forms/select/selectDataSource/useSelectProductGroup";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { ProductGroupDto } from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import { useTranslation } from "react-i18next";
import { ProductGroupCreateOrUpdateForm } from "@pages/ProductManagement/ProductGroup/forms/CreateOrUpdateForm";
import { ProductGroupService } from "@api/ProductGroupService";

export const SelectAddNewProductGroup = (props: {
  onChange?: (data: any) => void;
  value?: any;
  hiddenAddNew?: boolean;
  maxTagCount?: number;
}) => {
  const { hiddenAddNew, ...rest } = props;
  const { value, onChange } = props;
  const [newItem, setNewItem] = useState<IOrdSelectOption | undefined>(
    undefined
  );
  const { productGroupStore: mainStore, selectDataSourceStore } = useStore();
  const clickAdd = () => {
    mainStore.openCreateModal();
  };
  const onSavedSuccess = async (dto: ProductGroupDto) => {
    if (dto && dto.id) {
      selectDataSourceStore.clearByName("ProductGroup");
      mainStore.refreshGridData().then();
      await selectDataSourceStore.getOptions("ProductGroup", async () => {
        const result = await ProductGroupService.getComboOptions({});
        return Utils.mapCommonSelectOption(result);
      });

      setNewItem({
        value: dto.id,
        label: dto.groupName,
        fts: Utils.toLowerCaseNonAccentVietnamese(dto.groupName),
      });
      let newValues: number[] = value || [];
      newValues.push(+dto.id);
      if (onChange) {
        onChange(newValues);
      }
    }
  };
  return (
    <>
      <Space.Compact style={{ width: "100%" }}>
        <OrdSelect
          {...rest}
          mode={"multiple"}
          value={value}
          newOption={newItem}
          datasource={useSelectProductGroup()}
          allowClear
        />
        {props.hiddenAddNew !== true && (
          <>
            <Button type={"primary"} className={"h-auto"} onClick={clickAdd}>
              <PlusOutlined />
            </Button>
            <OrdCreateOrUpdateModal
              stored={mainStore}
              onSavedSuccess={onSavedSuccess}
              entityForm={() => <ProductGroupCreateOrUpdateForm />}
            />
          </>
        )}
      </Space.Compact>
    </>
  );
};
