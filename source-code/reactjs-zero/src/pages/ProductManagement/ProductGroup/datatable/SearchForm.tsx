import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Col, Form } from "antd";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectProductGroupType } from "@ord-components/forms/select/selectDataSource/useSelectProductGroupType";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";

export const ProductGroupSearchForm = () => {
  const { t } = useTranslation("product");
  const { t: tCommon } = useTranslation("common");
  const f = Form.useFormInstance();

  return (
    <>
      {/* <Col  {...useResponsiveSpan(6)}>
                <FloatLabel label={t('type')}>
                    <Form.Item name='type'>
                        <OrdSelect datasource={useSelectProductGroupType()}
                                   placeholder={tCommon('')}></OrdSelect>
                    </Form.Item>
                </FloatLabel>
            </Col> */}
      <SearchIsActived span={4} />
      <SearchFilterText span={10} />
    </>
  );
};
