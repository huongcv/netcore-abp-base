import { Form, Space } from "antd";
import { useTranslation } from "react-i18next";

import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";

export const SearchProductPriceList = () => {
    const { t } = useTranslation('price-list-detail');

    const form = Form.useFormInstance();

    return (
        <>
            <div>
                {
                    <Space.Compact style={{ width: '100%', marginBottom: '12px' }}>
                        <SearchFilterText
                            span={10}
                            labelFilter={t('labelSearch')}
                            placeHolder={t('filterSearch')}
                            isCustomReset={true}
                            onReset={() => {
                                form.setFieldValue('filter', ''); 
                                form.submit();
                            }}
                        />
                    </Space.Compact>
                }

            </div>
        </>
    )
}
