import { ICommonSelectInputProp } from "@ord-components/forms/model/SelectProp";
import { useStore } from "@ord-store/index";
import { BaseOptionType } from "rc-select/lib/Select";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

export enum DictionaryTypeEnum {
  Gender = 1,
  Job = 2,
}

const SelectDictionaryType = (prop: ICommonSelectInputProp) => {
  const [t] = useTranslation("dictionary");
  const [options, setOptionsDic] = useState<BaseOptionType[]>([]);

  useEffect(() => {
    const dictionaryTypes = Object.values(DictionaryTypeEnum).filter(
      (v) => typeof v === "number"
    ) as number[];
    setOptionsDic(
      dictionaryTypes.map((d) => {
        return {
          value: d,
          label: t("dictionaryType." + d),
        };
      })
    );
  }, []);
  return <Select {...prop} options={options} />;
};
export default observer(SelectDictionaryType);
