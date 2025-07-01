import React, {useMemo} from "react";
import {PageBreadcrumbFormPathName} from "@ord-components/common/page/PageBreadcrumb";
import {useTranslation} from "react-i18next";
import {Button, Space} from "antd";
import {Link, useLocation} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

export const DetailEntityPageTitle = () => {
    const {t} = useTranslation();
    const location = useLocation();

    const {pathname} = useLocation();
    const parentPath = useMemo(() => {
        return pathname.split('/').slice(0, -2).join('/') || '/';
    }, [pathname]);
    return (
        <div className="flex flex-wrap items-center justify-between mb-3">
            <PageBreadcrumbFormPathName
                mainTitle={t('detail_title_page')}
                pathname={parentPath}
            />
            <div className="flex items-center">
                <Space wrap>
                    <Link to={parentPath}>
                        <Button icon={<ArrowLeftOutlined/>}>
                            {t('returnList', {ns: 'common'})}
                        </Button>
                    </Link>
                </Space>
            </div>
        </div>
    );
};
