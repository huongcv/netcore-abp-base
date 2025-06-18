import {SearchOutlined} from "@ant-design/icons";
import {Button, Col} from "antd";
import * as React from "react";
import {useTranslation} from "react-i18next";

interface ISearchBtnInBoxProp {
    isCenterBottom?: boolean,
    span?: number
}

export const SearchBtnInBox = (prop: ISearchBtnInBoxProp) => {
    const {t} = useTranslation(['common']);
    return (
        <Col span={prop.isCenterBottom === true ? 24 : (prop?.span || 3)}
             className={(prop.isCenterBottom === true ? 'text-center' : '')}>
            {prop.isCenterBottom === true ? <>
                    <Button type="primary" htmlType="submit">
                        <SearchOutlined/>
                        {t('search')}
                    </Button>
                </> :
                <Button type="primary" htmlType="submit">
                    <SearchOutlined/>
                    {t('search')}
                </Button>
            }

        </Col>);
}
