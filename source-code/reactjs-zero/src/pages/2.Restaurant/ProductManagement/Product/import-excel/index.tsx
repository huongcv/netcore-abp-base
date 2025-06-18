import {observer} from "mobx-react-lite";
import {TitleWithActionInRight} from "@ord-components/common/h-title/TitleWithActionInRight";
import {Button, Card, Col, Row} from "antd";
import {useTranslation} from "react-i18next";
import React from "react";
import {Link} from "react-router-dom";
import './index.scss';
import ExcelFileUploadForm from "@pages/ProductManagement/Product/import-excel/ExcelFileUploadForm";
import {ArrowLeftOutlined} from "@ant-design/icons";

const ImportExcelProduct = () => {
    const {t} = useTranslation('product');
    return (<>
        <TitleWithActionInRight title={t('importExcel')}>
            <Link to={'/product'}>
                <Button><ArrowLeftOutlined></ArrowLeftOutlined>{t('returnList', {
                    ns: 'common'
                })}</Button>
            </Link>
        </TitleWithActionInRight>
        <Card title={t('importExcelTitle')}>
            <Row>
                <Col span={24}>
                    <ExcelFileUploadForm/>
                </Col>
            </Row>
        </Card>
    </>);
}
export default observer(ImportExcelProduct);
