import {observer} from "mobx-react-lite";
import {TitleWithActionInRight} from "@ord-components/common/h-title/TitleWithActionInRight";
import {Button, Card, Col, Row} from "antd";
import {useTranslation} from "react-i18next";
import React, {useRef} from "react";
import {Link} from "react-router-dom";
import './index.scss';
import ExcelFileUploadForm from "@pages/ProductManagement/Product/import-excel/ExcelFileUploadForm";
import {ArrowLeftOutlined} from "@ant-design/icons";
import Utils from "@ord-core/utils/utils";

const ImportExcelProduct = () => {
    const {t} = useTranslation('product');
    const pathNameRef = useRef<string>(Utils.getPathUpTo('/product'));

    return (<>
        <TitleWithActionInRight title={t('importExcel')}>
            <Link to={pathNameRef.current}>
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
