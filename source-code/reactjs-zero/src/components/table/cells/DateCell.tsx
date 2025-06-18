import React from 'react';
import DateUtil from "@ord-core/utils/date.util";

interface DateDisplayProps {
    date: Date | string | undefined;
    format?: string;
}

const DateCell: React.FC<DateDisplayProps> = ({date, format}) => {
    // const formatDate = (date: Date | string | undefined): string => {
    //     if (!date) return "";
    //
    //     const parsedDate = typeof date === "string" ? new Date(date) : date;
    //
    //     if (isNaN(parsedDate.getTime())) return "";
    //
    //     const day = String(parsedDate.getDate()).padStart(2, "0");
    //     const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    //     const year = parsedDate.getFullYear();
    //
    //     return `${day}/${month}/${year}`;
    // };
    return <span>{ DateUtil.toFormat(date ,format?? 'DD/MM/YYYY' )}</span>;
};

export default DateCell;
