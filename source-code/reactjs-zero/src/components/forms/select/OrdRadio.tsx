import {observer} from "mobx-react-lite";
import {Radio} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {CheckboxOptionType} from "antd/es/checkbox/Group";
import {RadioGroupProps} from "antd/es/radio/interface";

export interface IOrdRadioProp extends RadioGroupProps {
    datasource: SelectDataSource;
}


const OrdRadio = (props: IOrdRadioProp) => {
    const [options, setOptions] = useState<CheckboxOptionType[]>([]);
    useEffect(() => {
        setOptions(props.datasource.data.map(x => {
            return {
                value: x.value,
                title: x.title,
                label: x.label,
                disabled: x.disabled
            } as CheckboxOptionType
        }));
    }, [props.datasource]);


    return (
        <Radio.Group
            options={options}
            {...props}
        >
        </Radio.Group>
        // <Select className='w-full'
        //             {...rest}
        //             placeholder={props.placeholder || t('filterSelectCommonPlaceholder')}
        //             options={options}
        //             loading={loading}
        //             showSearch
        //             filterOption={(input, option) => onSearchOption(input, option)}
    );
}
export default observer(OrdRadio);
