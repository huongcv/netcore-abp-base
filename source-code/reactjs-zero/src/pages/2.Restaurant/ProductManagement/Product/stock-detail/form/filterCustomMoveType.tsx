import {FormInstance} from "antd";
import {Tag} from "antd/lib";
import {FilterOutlined} from "@ant-design/icons";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import React, {useEffect, useState} from "react";
import {useSelectMoveType} from "@ord-components/forms/select/selectDataSource/useSelectMoveType";

export const FilterCustomMoveType = (props: {
    searchRef: FormInstance,
    moveTypeFilter: any,
}) => {
    const moveType_Ds = useSelectMoveType();
    const {searchRef, moveTypeFilter} = props;
    const [show,setShow] = useState(false);
    const addFilterMoveType = (moveType: any) => {
        searchRef?.setFieldValue('moveType', moveType);
        searchRef?.submit();
    }
    const clearMoveType = () => {
        addFilterMoveType(null);
        setShow(false);
    }
    useEffect(() => {
       if(moveTypeFilter){
           setShow(true);
           addFilterMoveType(moveTypeFilter);
       }
    }, [moveTypeFilter]);
    return (
        <>
            {
                show && <Tag closeIcon onClose={clearMoveType}>
                    <FilterOutlined className={'ms-1'}></FilterOutlined>
                    <DisplayTextFormSelectDataSource value={moveTypeFilter}
                                                     datasource={moveType_Ds}/>
                </Tag>
            }

        </>
    );
}
