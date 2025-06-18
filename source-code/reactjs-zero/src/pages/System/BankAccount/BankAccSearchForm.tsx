import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectBank } from "@ord-components/forms/select/selectDataSource/useSelectBank";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import {Button, Col, Form, Select, Space} from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import AddNewEntity from "@ord-components/btn-action/AddNewEntity";
import {useStore} from "@ord-store/index";

const BankAccSearchForm = () => {
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("bankAccount");
  const { bankAccountStore: mainStore } = useStore();
  return (
    <>
      <Col {...useResponsiveSpan(8)}>
        <Space.Compact style={{ width: "100%", gap: 15 }}>
          <FloatLabel style={{ width: "65%" }} label={t("bankCode")}>
            <Form.Item name="bankCode">
              <OrdSelect datasource={useSelectBank()} />
            </Form.Item>
          </FloatLabel>
          <FloatLabel style={{ width: "35%" }} label={t("isActived")}>
            <Form.Item name="isActived">
              <Select placeholder={t("isActived")}>
                <Select.Option value="true">{t("yes")}</Select.Option>
                <Select.Option value="false">{t("no")}</Select.Option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Space.Compact>
      </Col>
      <SearchFilterText span={8} />
      <Col {...useResponsiveSpan(8)} className='text-right'>
        <AddNewEntity onClick={()=>{
          mainStore.openCreateModal()
        }}></AddNewEntity>
      </Col>
    </>
  );
};
export default observer(BankAccSearchForm);
