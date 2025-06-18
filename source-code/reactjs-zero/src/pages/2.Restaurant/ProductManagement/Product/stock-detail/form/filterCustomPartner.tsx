import {FormInstance} from "antd";
import {Tag} from "antd/lib";
import {FilterOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {ProductInventoryMoveDto} from "@api/index.defs";
import {DisplayPartner} from "@pages/Partner/Shared/DisplayPartner";

export const FilterCustomPartner = (props: {
    searchRef: FormInstance,
    dto: ProductInventoryMoveDto | null
}) => {
    const {searchRef, dto} = props;
    const [show, setShow] = useState(false);
    const addFilter = (dto: ProductInventoryMoveDto | null) => {
        searchRef?.setFieldValue('partnerId', dto?.partnerId);
        searchRef?.submit();
    }
    const clearMoveType = () => {
        addFilter(null);
        setShow(false);
    }
    useEffect(() => {
        if (dto) {
            addFilter(dto);
            setShow(true);
        }

    }, [dto]);
    return (
        <>
            {
                show && <Tag closeIcon onClose={clearMoveType}>
                    <FilterOutlined className={'ms-1'}></FilterOutlined>
                    <DisplayPartner {...dto}/>
                </Tag>
            }

        </>
    );
}
