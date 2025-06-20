import React from "react";
import {PageBreadcrumbFormPathName} from "@ord-components/common/page/PageBreadcrumb";
import {useTranslation} from "react-i18next";
import {Button, Space} from "antd";
import {Link, useLocation} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

export const ImportPageTitle = () => {
    const {t} = useTranslation('import');
    const location = useLocation();

    // Remove "/import" from pathname
    const basePath = location.pathname.replace('/import', '');

    return (
        <div className="flex flex-wrap items-center justify-between mb-3">
            <PageBreadcrumbFormPathName
                mainTitle={t('pageTitle')}
                pathname={basePath}
            />
            <div className="flex items-center">
                <Space wrap>
                    <Link to={basePath}>
                        <Button icon={<ArrowLeftOutlined/>}>
                            {t('returnList', {ns: 'common'})}
                        </Button>
                    </Link>
                </Space>
            </div>
        </div>
    );
};
