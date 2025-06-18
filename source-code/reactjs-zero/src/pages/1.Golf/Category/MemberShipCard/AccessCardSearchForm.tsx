import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useAccessCardStatusEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardStatusEnum";
import { useAccessCardTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectAccessCardTypeEnum";
import { useSelectIsActived } from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import { useStore } from "@ord-store/index";
import { Row, Form } from "antd";
import { useTranslation } from "react-i18next";

export const AccessCardSearchForm = () => {
  const { golfAccessCardStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tCommon } = useTranslation("common");
  return (
    <>
        <ColSpanResponsive span={12}>
          <Row gutter={16}>
            <ColSpanResponsive span={8}>
                <FloatLabel label={t("cardType")}>
                    <Form.Item name="cardType">
                    <OrdSelect datasource={useAccessCardTypeEnum()} allowClear />
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <FloatLabel label={t("accessStatus")}>
                    <Form.Item name="accessStatus">
                    <OrdSelect datasource={useAccessCardStatusEnum()} allowClear />
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <FloatLabel label={t("status")}>
                    <Form.Item name="isActived">
                    <OrdSelect datasource={useSelectIsActived()} allowClear />
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
          </Row>
        </ColSpanResponsive>
        <SearchFilterText span={12} placeHolder={t("golfAccessCardSearching")} />
    </>
  );
};
