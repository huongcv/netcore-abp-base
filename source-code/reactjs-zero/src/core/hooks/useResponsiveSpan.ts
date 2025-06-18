import {useEffect, useState} from 'react';
import {ColProps, ColSize} from "antd/es/grid/col";
import {a} from "vite/dist/node/types.d-aGj9QkWt";

export const useResponsiveSpan = (width: number) => {
    const [spanResponsive, setSpanResponsive] = useState<ColProps>();

    useEffect(() => {
        setSpanResponsive({

            span: 24,
            sm: 24,
            md: width < 8 ? 12 : 24,
            lg: width
        });
    }, [width]);

    return spanResponsive;
};

interface ISpanResponsive {
    span?: number | string;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
}
