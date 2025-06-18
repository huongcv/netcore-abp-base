import { CustomIconComponentProps } from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            {/* Thân hộp quà */}
            <rect x="5" y="7" width="10" height="8" fill="none" stroke="#636363" strokeWidth="1"/>
            {/* Nắp hộp quà */}
            <path
                d="M5 7L3 5H17L15 7"
                fill="none"
                stroke="#636363"
                strokeWidth="1"/>
            {/* Dây nơ trên hộp */}
            <path
                d="M10 2C9 3 8 4 8 5H12C12 4 11 3 10 2Z"
                fill="none"
                stroke="#636363"
                strokeWidth="1"/>
            <line x1="10" y1="5" x2="10" y2="15" stroke="#636363" strokeWidth="1"/>
            {/* Các hình tròn nhỏ tượng trưng cho điểm */}
            <circle cx="7" cy="11" r="1" fill="none" stroke="#636363" strokeWidth="1"/>
            <circle cx="10" cy="11" r="1" fill="none" stroke="#636363" strokeWidth="1"/>
            <circle cx="13" cy="11" r="1" fill="none" stroke="#636363" strokeWidth="1"/>
        </svg>
    );
}

export const PointAccumulationIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);