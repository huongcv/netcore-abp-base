import {AutoComplete} from "antd";
import * as React from "react";
import Utils from "@ord-core/utils/utils";
import {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";

export const ProductUnitAutoComplete = (props: {
    placeholder?: React.ReactNode;
    style?: React.CSSProperties;
    onChange?: (value: any, option: any | any[]) => void;
    disabledOptions?: string[]; // Thêm prop để nhận danh sách các mục cần vô hiệu hóa
    [key: string]: string | unknown;
}) => {
    const units = [ "Bánh", "Bình", "Bịch", "Bộ", "Bơm tiêm", "Bút tiêm", "Cái", "Can", "Cặp", "Cuộn",
        "Chai", "Chiếc", "Đôi", "Gói", "Hoàn", "Hộp", "Hũ", "Kit", "Kg", "Liều", "Lọ", "Lốc",
        "Nang", "Ống", "Que", "Thùng", "Túi", "Tube", "Vỉ", "Viên", "Vòng", "Xy lanh", "Dụng cụ",
        "Kim tiêm", "mCi", "Que cấy", "Thanh cấy", "Hộp nhỏ", "Hộp vừa", "Hộp lớn", "Hộp siêu lớn",
        "Hộp khác", "Chai nhỏ", "Chai vừa", "Chai lớn", "Chai siêu lớn", "Chai khác", "Lọ nhỏ",
        "Lọ vừa", "Lọ lớn", "Lọ siêu lớn", "Lọ khác", "Thùng nhỏ", "Thùng vừa", "Thùng lớn",
        "Thùng siêu lớn", "Bịch nhỏ", "Bịch vừa", "Bịch lớn", "Bịch siêu lớn", "Túi nhỏ", "Túi vừa",
        "Túi lớn", "Túi siêu lớn", "Tube vừa", "Tube lớn", "Hũ nhỏ", "Hũ vừa", "Hũ lớn", "Hũ khác",
        "Dây", "Tờ", "Lít", "Mét", "Lon", "Cây", "Set", "Sợi", "Ont", "Tép", "Bút", "Test", "Thỏi",
        "Quả", "Cọc", "Lá", "Tube nhỏ", "Gram", "Khay", "Phim", "Bao", "Gói nhỏ", "Khác", "Lần",
        "Tuýp", "HC90", "Ml", "Muỗng cà phê", "Giọt", "Miếng"];
    const options: IOrdSelectOption[] = units.map(it => {
        const normalizedValue = Utils.toLowerCaseNonAccentVietnamese(it);
        return {
            value: it,
            fts: normalizedValue,
            disabled: props.disabledOptions?.some(
                (opt) => Utils.toLowerCaseNonAccentVietnamese(opt) === normalizedValue
            ),
        };
    });

    const onSearchOption = (input: any, option?: IOrdSelectOption) => {
        const fts = option?.fts || '';
        return fts.toLowerCase().includes(Utils.toLowerCaseNonAccentVietnamese(input.toLowerCase()));
    };

    const handleChange = (value: any, option: any | any[]) => {
        if (props.onChange) {
            props.onChange(value, option);
        }
    };

    return (
        <AutoComplete
            {...props}
            options={options}
            placeholder={props.placeholder}
            showSearch
            filterOption={(input, option) => onSearchOption(input, option)}
            allowClear
            onChange={handleChange}
        />
    );
};
