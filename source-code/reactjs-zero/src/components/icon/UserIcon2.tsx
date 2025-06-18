import { CustomIconComponentProps } from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M7.00065 6.99984C8.61148 6.99984 9.91732 5.694 9.91732 4.08317C9.91732 2.47234 8.61148 1.1665 7.00065 1.1665C5.38982 1.1665 4.08398 2.47234 4.08398 4.08317C4.08398 5.694 5.38982 6.99984 7.00065 6.99984Z"
                fill="currentColor"
            />
            <path
                d="M6.99977 8.4585C4.07727 8.4585 1.69727 10.4185 1.69727 12.8335C1.69727 12.9968 1.8256 13.1252 1.98893 13.1252H12.0106C12.1739 13.1252 12.3023 12.9968 12.3023 12.8335C12.3023 10.4185 9.92227 8.4585 6.99977 8.4585Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const UserIcon2 = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
