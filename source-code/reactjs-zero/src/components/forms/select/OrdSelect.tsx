import {observer} from "mobx-react-lite";
import {Select} from "antd";
import * as React from "react";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {BaseOptionType, DefaultOptionType} from "rc-select/lib/Select";
import Utils from "@ord-core/utils/utils";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import {useTranslation} from "react-i18next";
import {RenderNode} from "@ord-components/forms/model/ICommonInputProp";
import type {FlattenOptionData} from "rc-select/lib/interface";
import {SelectProps} from "antd/es/select";

export interface IOrdSelectProp extends IBaseOrdSelectProp {
    datasource: SelectDataSource;
    autoFocus?: boolean;
    onSelectRefReady?: (selectRef: MutableRefObject<any>) => void;
}

export interface IBaseOrdSelectProp extends SelectProps<any, any> {
    placeholder?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onChange?: (
        value: any,
        option: IOrdSelectOption | IOrdSelectOption[]
    ) => void;
    defaultValue?: any | null;
    mode?: "multiple" | "tags";
    value?: any;
    newOption?: IOrdSelectOption;
    allowClear?:
        | boolean
        | {
        clearIcon?: RenderNode;
    };
    dropdownRender?: (menu: React.ReactElement) => React.ReactElement;
    optionRender?: (
        oriOption: FlattenOptionData<any>,
        info: {
            index: number;
        }
    ) => React.ReactNode;

    [key: string]: any
}

export interface IOrdSelectOption extends BaseOptionType {
    label?: React.ReactNode;
    value?: string | number | boolean | null;
    disable?: boolean;
    children?: Omit<DefaultOptionType, "children">[];
    fts?: string | string[] | null;
}

const OrdSelect = (props: IOrdSelectProp) => {
    const [options, setOptions] = useState<IOrdSelectOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<any>(null);
    const {newOption, ...rest} = props;
    const onSearchOption = (input: any, option?: IOrdSelectOption) => {
        const fts = option?.fts;
        const ftsStr = Array.isArray(fts) ? fts.join(" ") : fts || "";
        return ftsStr
            .toLowerCase()
            .includes(Utils.toLowerCaseNonAccentVietnamese(input.trim().toLowerCase()));
    };
    const {t} = useTranslation();
    useEffect(() => {
        setOptions(props.datasource.data || []);
        setLoading(props.datasource.isPending || false);
    }, [props.datasource]);
    useEffect(() => {
        if (newOption && newOption.value) {
            setOptions((prevOptions) => {
                if (!prevOptions.some((opt) => opt.value === newOption.value)) {
                    return [newOption, ...prevOptions];
                }
                return prevOptions;
            });
        }
    }, [newOption]);
    const selectRef = useRef<any>(null);
    useEffect(() => {
        if (props.onSelectRefReady) {
            props.onSelectRefReady(selectRef.current);  // khi mount để "giao lại" hàm cho cha.
        }
    }, []);
    return (
        <Select
            ref={selectRef}
            autoFocus={props.autoFocus}
            className={"w-full " + props?.className}
            {...rest}
            allowClear={props.allowClear != false}
            placeholder={props.placeholder || t("filterSelectCommonPlaceholder")}
            options={options}
            loading={loading}
            showSearch
            filterOption={(input, option) => onSearchOption(input, option)}
        />
    );
};
export default observer(OrdSelect);
