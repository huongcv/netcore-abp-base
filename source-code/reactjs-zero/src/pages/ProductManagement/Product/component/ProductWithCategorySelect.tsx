import React, { useEffect, useState } from 'react';
import {Select} from "antd";
import {OptionProps, SelectProps} from "antd/es/select";
import {GolfListProductWithCategoryComboOption, ProductDto} from "@api/index.defs";
import { GolfProductService } from '@api/GolfProductService';
import { useTranslation } from 'react-i18next';
import { use } from 'i18next';

type AntdOption = {
  label: string;
  value?: number | null | undefined;
  data?: ProductDto;
};

type GroupedAntdOption = {
  label: string;
  options: AntdOption | AntdOption[]; 
};
interface IProductWithCategorySelectProps extends Omit<SelectProps<number, GroupedAntdOption>,'options' | 'onChange'> {
    onChange?: (value: number | undefined, option?: GroupedAntdOption | GroupedAntdOption[]) => void;
    value?: number | null | undefined;
}

const ProductWithCategorySelect = (props: IProductWithCategorySelectProps) => {
    const [dataSourceOpt,setDataSourceOpt] = useState<GroupedAntdOption[]>([])
    const { t: tEnum } = useTranslation("enum");
    const [value,setValue] = useState<number | undefined>()
    
    useEffect(()=>{
        const temp = Number(props.value);
        setValue(temp ? temp : undefined)
    },[props.value])
    
    useEffect(()=> {
        const fetchDataProduct =  async () => {
            const result = await GolfProductService.getListProductWithCategoryComboOption();
            if(result.length > 0){
                const map  =result.map((pas)=> {
                    const items = pas.items?.map((p)=> {return { label: p.productName, value: p.id,data : p }}) as AntdOption[]
                    return {
                        label: tEnum(`ProductTypeGolfServiceEnum.${pas.categoryIdParseGolfService}`),
                        options: items,
                    } as GroupedAntdOption
                })
                setDataSourceOpt(map)
            }
        }
        fetchDataProduct();
    },[])
    
    return (
        <Select {...props} value={value} 
            onChange={(val, option) => {
                setValue(val);
                props.onChange?.(val, option);
            }} 
            options={dataSourceOpt}
            showSearch
            optionFilterProp='label' 
            filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
        ></Select>
    );
}

export default ProductWithCategorySelect;
