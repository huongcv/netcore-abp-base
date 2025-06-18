import { OrdSelectAndAddNew } from "@ord-components/forms/select/OrdSelectAndAddNew";
import CaddyCruModal from "../modal/CaddyCruModal";
import UiUtils from "@ord-core/utils/ui.utils";
import { PartnerDto } from "@api/index.defs";
import { GolfCaddyService } from "@api/GolfCaddyService";
import { useTranslation } from "react-i18next";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import { CommonResultDto } from "@ord-core/service-proxies/dto";
import { IOrdSelectOption } from "@ord-components/forms/select/OrdSelect";
import {
  CaddyRenderSelectItem,
  DisplayCaddyLabel,
  useSelectCaddy,
} from "@ord-components/forms/select/selectDataSource/useSelectCaddy";
import { useStore } from "@ord-store/index";
import utils from "@ord-core/utils/utils";
import { SelectProps } from "antd";

interface ICaddySelectProp extends SelectProps {
  onChange?: (value: any, option: any) => void;
  hiddenAddNewBtn?: boolean;
}

const SelectCaddy = (props: ICaddySelectProp) => {
  const [t] = useTranslation("GolfCaddy");
  const { selectDataSourceStore } = useStore();

  const clearDatasource = () => {
    const key = "Caddy";
    selectDataSourceStore.clearByName(key);
    selectDataSourceStore.getOptions(key, async () => {
      const result = await GolfCaddyService.getCaddyComboOption();
      if (!result || result.length === 0) {
        return [];
      }
      return utils.mapCommonSelectOption(result);
    });
  };

  const apiSave = async (formValue: any) => {
    UiUtils.setBusy();
    try {
      const input: PartnerDto = {
        ...formValue,
        type: 4,
      };
      const result = await GolfCaddyService.createOrUpdate({
        body: input,
      });

      if (result.isSuccessful) {
        UiUtils.showSuccess(t("addNewSuccess"));

        clearDatasource();
      } else {
        ServiceProxyUtils.notifyErrorResultApi(result, "caddy", {
          ...formValue,
        });
      }
      return result;
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
    return {
      isSuccessful: false,
    } as CommonResultDto<any>;
  };

  const handlerDoneAdd = (value: PartnerDto) => {
    if (value) {
      const op: IOrdSelectOption = {
        value: value.id,
        title: value.name,
        data: value,
      };
      if (props.onChange) props.onChange(value.id, op);
    }
  };
  return (
    <OrdSelectAndAddNew
      {...props}
      onChange={props.onChange}
      formContent={<CaddyCruModal />}
      apiAddNew={apiSave}
      nameDataSource={"Caddy"}
      renderSelectOptions={CaddyRenderSelectItem}
      optionRender={(option: any) => (
        <DisplayCaddyLabel dto={option.data?.data} />
      )}
      datasource={useSelectCaddy(4)}
      modalSetting={{
        width: 1200,
        style: {
          top: 30,
        },
      }}
      onAddDone={handlerDoneAdd}
      allowClear={true}
    />
  );
};
export default SelectCaddy;
