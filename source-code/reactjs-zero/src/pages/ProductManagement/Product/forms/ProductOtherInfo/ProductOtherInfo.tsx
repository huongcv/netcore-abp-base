import React from 'react';
import {Col, Form} from 'antd';
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectProcessingArea} from "@ord-components/forms/select/selectDataSource/useSelectProcessingArea";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";

const ProductOtherInfo = () => {
    const dataSource = useSelectProcessingArea();
    const {sessionStore} = useStore();
    const {t} = useTranslation('product');

    return (
        <>
            {sessionStore.isNhaHang && <Col span={6}>
                <FloatLabel
                    label={t("ProcessingArea")}
                >
                    <Form.Item name='processingAreaId'>
                        <OrdSelect placeholder='Chọn khu vực chế biến' datasource={dataSource}/>
                    </Form.Item>
                </FloatLabel>
            </Col>}
        </>
    );
};

export default ProductOtherInfo;

