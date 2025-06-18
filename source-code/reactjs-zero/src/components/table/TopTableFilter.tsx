import React, {useEffect, useState} from 'react';
import {Badge, Button} from "antd";
import './TopTableFilter.scss'

export interface ITopTableFilterData<TKEY = any> {
    count: number,
    label: string,
    key: TKEY
}

const TopTableFilter = (props: {
    data: ITopTableFilterData[],
    selectedValue?: any,
    onClickItem?: (val: any) => void
}) => {
    const [dataSource, setDataSource] = useState<ITopTableFilterData[]>();
    const [selectedValue, setSelectedValue] = useState();
    useEffect(() => {
        setDataSource(props.data ?? []);
    }, [props.data]);
    useEffect(() => {
        setSelectedValue(props.selectedValue);
    }, [props.selectedValue]);
    return (
        <div className='flex p-[4px] pr bg-[#EEEEEE] rounded w-fit'>
            {
                dataSource?.map((x, index) => {
                        return <Button type={'text'}
                                       className={
                                           selectedValue == x.key ? 'h-[36px] mr-1 btn-itemTop active' : 'h-[36px] mr-1 btn-itemTop not-active'
                                       }
                                       key={index} onClick={() => {
                            setSelectedValue(x.key);
                            if (props?.onClickItem)
                                props?.onClickItem(x.key);
                        }}>
                            <div className='item-label pl-3.5 pr-3.5'>
                                <span>{x.label}</span> <Badge
                                color={x.key== selectedValue?'var(--active-color)':"#D0D0D0"}
                                showZero={true}
                                overflowCount={9999} count={x.count}></Badge>
                            </div>
                        </Button>
                    }
                )
            }

        </div>
    );
};

export default TopTableFilter;
