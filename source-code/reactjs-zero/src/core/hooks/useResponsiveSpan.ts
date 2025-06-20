import {useEffect, useState} from 'react';
import {ColProps, ColSize} from "antd/es/grid/col";

export const useResponsiveSpan = (width: number) => {
    const [spanResponsive, setSpanResponsive] = useState<ColProps>({
        span: 24,
        sm: 24,
        md: width < 8 ? 12 : 24,
        lg: width < 8 ? 8 : width < 16 ? 16 : 24,
        xl: width
    });

    useEffect(() => {
        setSpanResponsive({

            span: 24,
            sm: 24,
            md: width < 8 ? 12 : 24,
            lg: width < 8 ? 8 : width < 16 ? 16 : 24,
            xl: width
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
