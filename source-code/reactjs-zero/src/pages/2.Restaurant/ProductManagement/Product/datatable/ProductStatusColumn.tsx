import {StatusCell} from "@ord-components/table/cells/StatusCell";
import React from "react";
import {ColumnType} from "antd/es/table/interface";
import {l} from "@ord-core/language/lang.utils";
import {ProductDto} from "@api/index.defs";
import {Tag} from "antd";
import {useTranslation} from "react-i18next";

export const ProductStatusColumn = () => {
    const {t} = useTranslation('product');
    return {
        title: l.transCommon('status'),
        dataIndex: 'isActived',
        render: (_: any, record: ProductDto) => {
            if(record.isTemplateProduct){
                return <Tag className="me-0" >
                    {t('counter.totalNotInBusiness')}
                </Tag>;
            }else{
                return (< StatusCell isActived={record.isActived}/>)
            }
        },
    } as ColumnType;
};
